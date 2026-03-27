import type { CSSProperties, MouseEventHandler } from "react";

type HoverRollLinkBaseProps = {
  text: string;
  className?: string;
  enableWipe?: boolean;
};

type HoverRollAnchorProps = HoverRollLinkBaseProps & {
  as?: "a";
  href: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type HoverRollButtonProps = HoverRollLinkBaseProps & {
  as: "button";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

type HoverRollLinkProps = HoverRollAnchorProps | HoverRollButtonProps;

type HoverRollCharStyle = CSSProperties & Record<`--${string}`, string>;

function getClassName(className?: string, enableWipe?: boolean) {
  return ["hover-roll-link", enableWipe !== false ? "is-wipe" : "", className]
    .filter(Boolean)
    .join(" ");
}

function renderTextLayer(text: string, layerClassName: string) {
  return (
    <span className={`hover-roll-link-layer ${layerClassName}`}>
      {Array.from(text).map((character, index) => {
        const style: HoverRollCharStyle = {
          "--char-index": `${index}`,
        };

        return (
          <span
            key={`${layerClassName}-${index}-${character}`}
            className="hover-roll-link-char"
            style={style}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        );
      })}
    </span>
  );
}

export default function HoverRollLink(props: HoverRollLinkProps) {
  const content = (
    <>
      <span className="hover-roll-link-track" aria-hidden="true">
        {renderTextLayer(props.text, "is-current")}
        {renderTextLayer(props.text, "is-next")}
      </span>
      <span className="hover-roll-link-sr">{props.text}</span>
    </>
  );

  if (props.as === "button") {
    const { as: _as, text, className, enableWipe, type = "button", onClick } = props;

    return (
      <button
        type={type}
        onClick={onClick}
        className={getClassName(className, enableWipe)}
      >
        {content}
      </button>
    );
  }

  const { as: _as, text, className, enableWipe, href, target, rel, onClick } = props;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={getClassName(className, enableWipe)}
      onClick={onClick}
    >
      {content}
    </a>
  );
}
