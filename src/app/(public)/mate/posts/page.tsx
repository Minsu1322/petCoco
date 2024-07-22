
import PostForm from "../_components/postForm";

const MatePost = ({ params }: { params: { id: string } }) => {
  return (
    <div className="px-2">
      <PostForm />
    </div>
  );
};

export default MatePost;
