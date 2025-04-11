import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
	const getPostsEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/getAll";
			case "following":
				return "/api/posts/getByFollowing";
			case "posts":
				return `/api/posts/getByUser/${username}`;
			case "likes":
				return `/api/posts/getLikedPosts/${userId}`;
			default:
				return "/api/posts/getAll";
		}
	};

	const POSTS_ENDPOINT = getPostsEndpoint();

	const { data:posts, isLoading, isRefetching, refetch } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const res = await fetch(POSTS_ENDPOINT);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Error fetching posts.");
			}

			return data;
		}
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className="flex flex-col justify-center">
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			
      {!isLoading && !isRefetching && posts?.length === 0 && <p className="text-center my-4">No posts in this tab. Switch 👻</p>}
			
      {!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

export default Posts;
