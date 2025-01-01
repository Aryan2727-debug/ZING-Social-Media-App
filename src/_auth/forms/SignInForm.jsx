
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SigninValidation } from "../../lib/validation";
import Loader from "../../components/shared/Loader";
import { useSignInAccount } from "../../lib/react-query/queriesAndMutations";
import { useUserContext } from "../../context/AuthContext";

const SignInForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount } = useSignInAccount();

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: ''
    },
  });
  
  async function onSubmit(values) {
    const session = await signInAccount({
      email: values.email,
      password: values.password
    });

    if (!session) {
      return toast({
        title: "Sign in failed. Please try again."
      });
    };

    const isLoggedIn = await checkAuthUser();

    console.log(isLoggedIn);

    if (isLoggedIn) {
      form.reset();
      navigate('/');
      console.log('NAVIGATING');
    } else {
      return toast({
        title: "Sign in failed. Please try again."
      });
    };
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img 
        src="/assets/images/zing-logo.jpg" 
        alt="logo" 
        height={80}
        width={180}
        />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back to Zing! Please enter your account details!</p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : "Sign In"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Do not have an account?
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
