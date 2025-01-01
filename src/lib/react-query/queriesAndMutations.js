import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { 
    createUserAccount,
    signInAccount, 
    signOutAccount, 
    createPost, 
    getRecentPosts, 
    likePost, 
    savePost, 
    deleteSavedPost, 
    getCurrentUser, 
    getPostById, 
    updatePost, 
    deletePost,
    getInfinitePosts,
    searchPosts
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user) => createUserAccount(user)
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user) => signInAccount(user)
    });
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    });
};

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: () => getRecentPosts()
    });
};

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    });
};

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    });
};

export const useDeleteSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    });
};

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser()
    });
};

export const useGetPostById = (postId) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, imageId }) => deletePost(postId, imageId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    });
};

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }
            const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;

            return lastId;
        }
    });
};

export const useSearchPosts = (searchTerm) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    });
};