interface ItemButtonProps {
  text: string | null;
  className?: string;
}

const ItemButton = ({text, className}: ItemButtonProps) => {
  return (
    <div className={className}>{text}</div>
  )
}

export default ItemButton