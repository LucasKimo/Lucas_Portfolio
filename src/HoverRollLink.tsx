import type { MouseEventHandler } from "react";

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
};

type HoverRollButtonProps = HoverRollLinkBaseProps & {
  as: "button";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

type HoverRollLinkProps = HoverRollAnchorProps | HoverRollButtonProps;

function getClassName(className?: string, enableWipe?: boolean) {
  return ["hover-roll-link", enableWipe !== false ? "is-wipe" : "", className]
    .filter(Boolean)
    .join(" ");
}

export default function HoverRollLink(props: HoverRollLinkProps) {
  const content = (
    <>
      <span className="hover-roll-link-track" aria-hidden="true">
        <span className="hover-roll-link-layer is-current">{props.text}</span>
        <span className="hover-roll-link-layer is-next">{props.text}</span>
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

  const { as: _as, text, className, enableWipe, href, target, rel } = props;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={getClassName(className, enableWipe)}
    >
      {content}
    </a>
  );
}
