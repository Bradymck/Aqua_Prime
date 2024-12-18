import React from 'react';
import Image from 'next/image';

interface LayerData {
  image: string;
  zIndex: number;
}

interface LayeredImageProps {
  layers: LayerData[];
  containerClassName?: string;
}

export const LayeredImage: React.FC<LayeredImageProps> = ({
  layers,
  containerClassName = ""
}) => {
  return (
    <div className={`relative w-full h-full ${containerClassName}`}>
      {layers.map((layer, index) => (
        <div
          key={`layer-${index}`}
          className="absolute inset-0"
          style={{ zIndex: layer.zIndex }}
        >
          <Image
            src={layer.image}
            alt={`Layer ${index + 1}`}
            fill
            className="object-contain"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}; 