import Post from "../_components/PostForm";

const MatePost = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <Post />
    </div>
  );
};

export default MatePost;
