import React from 'react';

interface RichTextProps {
  content: string;
  paddingBottom?: string;
  paddingTop?: string;
}

const RichText: React.FC<RichTextProps> = ({ content, paddingTop, paddingBottom }) => {

  const paddingdTopClass = paddingTop ? `padding-top-${paddingTop}` : 'padding-top-0';
  const paddingdBottomClass = paddingBottom ? `padding-bottom-${paddingBottom}` : 'padding-bottom-0';

  return <div className={`rich-text ${paddingdTopClass} ${paddingdBottomClass}`} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default RichText;
