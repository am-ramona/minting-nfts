"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  useStorageUpload,
  useMintNFT,
  useNFTCollection,
  ThirdwebNftMedia,
  useContract,
  useAddress,
  useMetamask
} from "@thirdweb-dev/react";

function ImagePreviewModal() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const pathname = usePathname();
  const address = useAddress();
  const { mutateAsync: upload } = useStorageUpload();

  const nftCollection = useNFTCollection(
    process.env.NEXT_PUBLIC_NFT_ADDRESS
  );
  const { mutate: mintNft, isLoading, error } = useMintNFT(nftCollection);

  if (typeof window !== 'undefined') {
    var image = localStorage.getItem('uploadedImage');
    var title = localStorage.getItem('title');
    var description = localStorage.getItem('description');
  }

  const generateOpenSeaMetadata = (imageUrl, imageTitle, imageDescription) => {
    const metadataObject = {
      name: imageTitle,
      description: imageDescription,
      image: imageUrl,
    };

    return metadataObject;
  };

  const uploadToIPFS = async () => {
    // Implement IPFS upload logic using the ipfs library
    // ...
    const metadataObject = generateOpenSeaMetadata(localStorage.getItem('uploadedImage'), localStorage.getItem('title'), localStorage.getItem('description'));
    const uris = await upload({ data: [metadataObject] });

    mintNft({
      metadata: {
        name: "Mint",
        ipfsHash: uris
      },
      to: process.env.NEXT_PUBLIC_NFT_ADDRESS,
    })
  };

  return (
    <>
      {modal && typeof window !== 'undefined' &&
        <dialog
          className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
          <div className="bg-black pt-[21.11px] px-[22.84px] pb-[32.89px] w-[457.297px] h-max text-white">
            <div className="grid items-center">
              {image && title && description &&
                <>
                  <Image
                    src={image && image}
                    alt='Preview NFT Image'
                    style={{ display: 'block' }}
                    // Revoke data uri after image is loaded
                    width='412'
                    height='346'
                    priority
                  />
                  <p className="font-cinzel text-[22px] font-bold leading-[32.235px]" >{title}</p>
                  <p className="font-opSans text-base/[24.644px] font-normal pb-[18.4px]" >{description}</p>
                </>
              }
              <Link href={pathname} className="justify-self-center">
                <button type="button" onClick={uploadToIPFS} disabled={!address} className="w-[155.722px] h-[63.078px] text-white text-base/[24.644px] bg-[url('/subtract.png')] bg-no-repeat bg-left-top bg-[length:155.722px_63.078px] disabled:cursor-not-allowed">Continue</button>
              </Link>
            </div>
          </div>
        </dialog>
      }
    </>
  );
}

export default ImagePreviewModal;