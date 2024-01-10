import React from "react";

import { useHistory, NavLink } from "react-router-dom";
import { Navigate } from "tools/Navigate";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import DefaultAuth from "layouts/auth/Default";
import { BaseUrl, jwt_cockies_name, Jwt_Refresh_Cockies_Name } from "variables/Api";

// Assets
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import Cookies from 'universal-cookie';
import { User } from "states/user";
import axios from "axios";
import { AxiosResponse, AxiosError } from 'axios';

interface SignInProps {
  message: string;
  loading: boolean;
}

interface resError {
  errors: { message: string, context: any; };
}

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = React.useState(false);
  const [UserCredets, setUserCredets] = React.useState<User>({ email: "", password: "" });
  const [SingInProps, setSingInProps] = React.useState<SignInProps>({ message: "", loading: false });

  const handleClick = () => setShow(!show);


  const cookies = new Cookies(null, { path: '/' });
  const history = useHistory();
  if (cookies.get(jwt_cockies_name))
    history.push('/admin');
  const SignInRequest = async () => {
    setSingInProps({ message: "Please Wait...", loading: true });
    try {
      const res: AxiosResponse = await axios.post(`http://localhost:8080/api/v1/auth`, {
        email: UserCredets.email,
        password: UserCredets.password,
      });
      let user_data = res.data as User;
      cookies.set(jwt_cockies_name, user_data.AccessToken);
      cookies.set(Jwt_Refresh_Cockies_Name, user_data.RefreshToken);
      history.push('/admin');
    } catch (error) {
      setSingInProps({ message: ((error as AxiosError).response?.data as resError).errors.message, loading: false });

    } finally {
      setSingInProps((val) => {
        return { ...val, loading: false }
      });

    }
  }

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign In
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your email and password to sign in!
          </Text>
        </Box>


        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mt={'30%'}
          mb={{ base: "20px", md: "auto" }}>
          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mt={'30px'}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='mail@simmmple.com'
              mb='24px'
              fontWeight='500'
              onChange={(e) => {
                setUserCredets({ ...UserCredets, email: e.target.value });
              }}
              size='lg'
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                onChange={(e) => {
                  setUserCredets({ ...UserCredets, password: e.target.value });
                }}
                variant='auth'
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent='space-between' align='center' mb='24px'>
              <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Keep me logged in
                </FormLabel>
              </FormControl>
            </Flex>
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              onClick={() => { SignInRequest() }}
              mb='24px'>
              Sign In
            </Button>
          </FormControl>


          <Text
            mb='36px'
            ms='4px'
            color={'red.400'}
            fontWeight='600'
            fontSize='lg'>
            {SingInProps.message}
          </Text>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
