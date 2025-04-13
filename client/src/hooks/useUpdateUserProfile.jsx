import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile} = useMutation({
      mutationFn: async (formData) => {
        const res = await fetch("/api/users/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "Update profile failed.");
        }
  
        return data;
      },
      onSuccess: () => {
        toast.success("Update profile successfully.");
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
          queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
          queryClient.invalidateQueries({ queryKey: ["posts"] })
        ]);
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;