import React from 'react';
import RichText from '../utils/rich-text';
import Animation from '../utils/animation';

interface HeroBannerProps {
  content: string;
  image: string;
  video: string; 
  position: 'left' | 'right';
  background: string;
  size: 'xl' | 'md' | 'xs' | 'auto';
  proportion: 'half' | 'one-third' | 'quarter';
  align: 'top' | 'center' | 'bottom';
  justify: 'left' | 'center' | 'right';
  gap: '1' | '2' | '3' | '4';
  paddingBottom?: string;
  paddingTop?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ content, image, video, position, background, size, proportion, align, justify, gap, paddingBottom, paddingTop }) => {
  const hasBackgroundImage = image !== '';
  const hasBackgroundVideo = video !== '';

  const paddingdTopClass = paddingTop ? `padding-top-${paddingTop}` : 'padding-top-0';
  const paddingdBottomClass = paddingBottom ? `padding-bottom-${paddingBottom}` : 'padding-bottom-0';

  return (
    <div className={`hero-banner size-${size} ${paddingdTopClass} ${paddingdBottomClass}`} style={{ backgroundImage: hasBackgroundImage ? `url('${background}')` : 'none' }}>
       {hasBackgroundVideo && (
          <video autoPlay muted loop className="video-background">
            <source src={`${video}.webm`} type="video/webm" />
            <source src={`${video}.mp4`} type="video/mp4" />
          </video>
        )}
      <div className={`content-container flex position-${position} proportion-${proportion} align-${align} justify-${justify} gap-${gap}`}>
        {hasBackgroundImage && <Animation direction="bottom"><img src={image} alt="Hero Image" /></Animation>}
        {content !== '' && <Animation direction="bottom"><RichText content={content} /></Animation>}
      </div>
    </div>
  );
};

export default HeroBanner;
