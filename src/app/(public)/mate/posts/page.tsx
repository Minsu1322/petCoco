import PostForm from "../_components/PostForm";

const MatePost = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <PostForm />
    </div>
  );
};

export default MatePost;
