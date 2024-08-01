interface ItemButtonProps {
  text: string | null;
  className?: string;
  p_className?: string;
}

const ItemButton = ({ text, className, p_className }: ItemButtonProps) => {
  return (
    <div className={className}>
      <p className={p_className}>{text}</p>
    </div>
  );
};

export default ItemButton;
