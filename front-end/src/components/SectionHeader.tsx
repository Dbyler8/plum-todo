import "./SectionHeader.css";

type TSectionHeaderProps = {
  title: string;
  titleId?: string;
  kicker?: string;
  subtitle?: string;
  variant?: "page" | "modal";
};

export default function SectionHeader({
  title,
  titleId,
  kicker,
  subtitle,
  variant = "page",
}: TSectionHeaderProps) {
  const titleClassName = variant === "modal" ? "section-header__title section-header__title--modal" : "section-header__title";
  const heading = variant === "modal" ? (
    <h2 id={titleId} className={titleClassName}>{title}</h2>
  ) : (
    <h1 id={titleId} className={titleClassName}>{title}</h1>
  );

  return (
    <div className={`section-header section-header--${variant}`}>
      {kicker ? <p className="section-header__kicker">{kicker}</p> : null}
      {heading}
      {subtitle ? <p className="section-header__subtitle">{subtitle}</p> : null}
    </div>
  );
}