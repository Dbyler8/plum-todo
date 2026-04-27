type TBrandIconProps = {
  className?: string;
};

export default function BrandIcon({ className }: TBrandIconProps) {
  return <img src="/purple-check.png" alt="" aria-hidden="true" className={className} draggable={false} />;
}