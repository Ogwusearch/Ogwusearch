// src/pages/Blog.jsx
import styled from "styled-components";

const BlogContainer = styled.div`
  max-width: 700px;
  margin: 3rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #0070f3;
  margin-bottom: 2rem;
`;

const Post = styled.article`
  border-bottom: 1px solid #ddd;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PostTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: #222;
`;

const PostDate = styled.time`
  font-size: 0.85rem;
  color: #888;
`;

const PostExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-top: 0.5rem;
`;

const Blog = () => {
  // Example blog posts data
  const posts = [
    {
      id: 1,
      title: "Starting My Journey as a Developer",
      date: "2025-05-10",
      excerpt:
        "In this post, I talk about how I got into programming and what motivated me to build Ogwusearch...",
    },
    {
      id: 2,
      title: "Top Tips for Building a Portfolio Website",
      date: "2025-04-20",
      excerpt:
        "A portfolio website is your digital handshake. Here are my best tips to make yours stand out...",
    },
    {
      id: 3,
      title: "Why React is My Go-To Framework",
      date: "2025-04-05",
      excerpt:
        "React’s component-based architecture and vibrant ecosystem make it my preferred choice. Here’s why...",
    },
  ];

  return (
    <BlogContainer>
      <Title>Blog</Title>
      {posts.map(({ id, title, date, excerpt }) => (
        <Post key={id}>
          <PostTitle>{title}</PostTitle>
          <PostDate>{new Date(date).toLocaleDateString()}</PostDate>
          <PostExcerpt>{excerpt}</PostExcerpt>
        </Post>
      ))}
    </BlogContainer>
  );
};

export default Blog;
