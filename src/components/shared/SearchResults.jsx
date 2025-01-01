import Loader from "./Loader";
import GridPostList from "./GridPostList";

const SearchResults = ({ isSearchFetching, searchedPosts }) => {
  if (isSearchFetching) {
    return <Loader />
  };

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchedPosts.documents} />
    )
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">
      No search results found
    </p>
  );
};

export default SearchResults;
