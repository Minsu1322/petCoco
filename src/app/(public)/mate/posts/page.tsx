import PostForm from "../_components/postForm";


const MatePost = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <PostForm />
    </div>
  );
};

export default MatePost;
