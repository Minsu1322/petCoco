export const fetchPostsMate = async () => {
  const response = await fetch("/api/mate?page=1&limit=5");
  console.log(response);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchPosts = async () => {
  const response = await fetch("/api/community?page=1&limit=5");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
