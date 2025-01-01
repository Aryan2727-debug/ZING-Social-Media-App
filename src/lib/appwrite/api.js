import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) {
            throw new Error("Failed to create a new account");
        }

        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        });
        return newUser;
    } catch (error) {
        console.log(error);
    };
};

export async function saveUserToDB(user) {
   try {
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user
      )
      return newUser;
   } catch (error) {
      console.log(error);
   };
};

export async function signInAccount(user) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch (error) {
        console.log(error);
    };
};

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) {
            throw new Error("Failed to get the current account");
        };

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if(!currentUser) {
            throw new Error("Failed to get the current user");
        };

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    };
};

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error);
    };
};

export async function createPost(post) {
    try {
      const uploadedFile = await uploadFile(post.file[0]);  

      if (!uploadedFile) {
          throw new Error("Failed to upload the file");
      };

      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
          deleteFile(uploadedFile.$id);
          throw new Error("Failed to get the file preview");
      };

      const tags = post.tags.replace(/ /g, '').split(',') || [];

      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags
        }
      );

      if (!newPost) {
          await deleteFile(uploadedFile.$id);
          throw new Error("Failed to create a new post");
      };

      return newPost;
    } catch (error) {
        console.log(error);
    };
};

export async function uploadFile(file) {
   try {
       const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
       );

       return uploadedFile;
   } catch (error) {
       console.log(error);
   };
};

export function getFilePreview(fileId) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId, 
            2000,
            2000,
            "top",
            100
        );

        return fileUrl;
    } catch (error) {
        console.log(error);
    };
};

export async function deleteFile(fileId) {
    try {
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        );
        
        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    };
};

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    );

    if (!posts) {
        throw new Error("Failed to get recent posts");
    };

    return posts;
};

export async function likePost(postId, likesArray) {
   try {
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId,
        {
            likes: likesArray
        }
      );
      
      if (!updatedPost) {
        throw new Error('Error in updating (LIKE) post');
      };

      return updatedPost;
   } catch (error) {
      console.log(error);
   };
};

export async function savePost(postId, userId) {
    try {
       const updatedPost = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.savesCollectionId,
         ID.unique(),
         {
             user: userId,
             post: postId
         }
       );
       
       if (!updatedPost) {
         throw new Error('Error in updating (SAVE) post');
       };
 
       return updatedPost;
    } catch (error) {
       console.log(error);
    };
};

export async function deleteSavedPost(savedRecordId) {
    try {
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        savedRecordId
      );
  
      if (!statusCode) throw Error;
  
      return { status: "Ok" };
    } catch (error) {
      console.log(error);
    }
};

export async function getPostById(postId) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );

        return post;
    } catch (error) {
        console.log(error);
    };
};
 
export async function updatePost(post) {
    const hasFileToUpdate = post.file.length > 0;
  
    try {
      let image = {
        imageUrl: post.imageUrl,
        imageId: post.imageId,
      };
  
      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;
  
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      //  Update post
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        post.postId,
        {
          caption: post.caption,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
          location: post.location,
          tags: tags,
        }
      );
  
      // Failed to update
      if (!updatedPost) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageId);
        }
  
        // If no new file uploaded, just throw error
        throw Error;
      }
  
      // Safely delete old file after successful update
      if (hasFileToUpdate) {
        await deleteFile(post.imageId);
      }
  
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
};

export async function deletePost(postId, imageId) {
    if (!postId || !imageId) {
        throw new Error('The post or image does not exist');
    };

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    };
};

export async function getInfinitePosts({ pageParam }) {
    const queries = [Query.orderDesc('$updatedAt'), Query.limit(12)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    };

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        );

        if (!posts) {
            throw new Error('Posts do not exist for explore page');
        };

        return posts;
    } catch (error) {
        console.log(error);
    };
};

export async function searchPosts(searchTerm) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        );

        if (!posts) {
            throw new Error('Posts do not exist for search');
        };

        return posts;
    } catch (error) {
        console.log(error);
    };
};

