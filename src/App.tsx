import { ReactNode, useEffect, useState } from 'react';
import BlogPosts, { BlogPost } from './components/BlogPosts';
import { get } from './util/http';
import fetchingImg from './assets/data-fetching.png';
import ErrorMessage from './components/ErrorMessage';

type RawDataBlogPost = {
  id: number;
  usedId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>(); //empty means undefined value assign to useState

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      try {
        const data = (await get(
          'https://jsonplaceholder.typicode.com/posts'
        )) as RawDataBlogPost[];

        const blogPosts = data.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          };
        });
        setFetchedPosts(blogPosts);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }

      setIsFetching(false);
    }

    fetchPosts();
  }, []);

  //Adding undefined check
  let content: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  if (isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>;
  }

  return (
    <main>
      <img
        src={fetchingImg}
        alt="An abstract image depicting a data fetching process."
      />
      {/* Hers it is undefined */}
      {/* <BlogPosts posts={fetchedPosts} /> */}
      {content}
    </main>
  );
}

export default App;
