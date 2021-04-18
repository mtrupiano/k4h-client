import { React, useState } from 'react';

import { Grommet, Box, Text, Button, Form, FormField, TextInput, Anchor } from 'grommet';

import API from "../utils/API";

export default function SignInForm(props) {
    const customTheme = {
        global: {
            colors: {
                focus: undefined
            }
        },
        formField: {
            focus: {
                background: {
                    color: 'white'
                }
            },
            border: undefined
        }
    }

    const [signInFormState, setSignInFormState] = useState({
        userName: '',
        password: ''
    });

    const [errorState, setErrorState] = useState();

    const handleSubmit = (event) => {
        event.preventDefault();
        API.signIn(signInFormState).then((response) => {
            localStorage.setItem("token", response.data.token);
            props.setUserState({
                id: response.data.user.id,
                userName: response.data.user.userName,
                firstName: response.data.user.firstName,
                lastName: response.data.user.lastName,
                email: response.data.user.email,
                portrait: response.data.user.portrait,
                bio: response.data.user.bio,
                isSignedIn: true,
                token: response.data.token
            });
            setSignInFormState({ userName: '', password: '' });
        }).catch( (err) => {
            localStorage.clear('token');
            setErrorState({password: err.responseText});
        });
    }


    const handleInput = (event) => {
        setErrorState();
        setSignInFormState({...signInFormState, [event.target.name]: event.target.value});
    }

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.'
        }
    }

    const handleGuestSignIn = () => {
        API.signIn({
            userName: 'Guest',
            password: 'guestP@ssw0rd'
        }).then((response) => {
            props.setUserState({
                id: response.data.user.id,
                userName: response.data.user.userName,
                firstName: response.data.user.firstName,
                lastName: response.data.user.lastName,
                email: response.data.user.email,
                portrait: response.data.user.portrait,
                bio: response.data.user.bio,
                isSignedIn: true,
                token: response.data.token
            })
        }).catch((err) => {
            localStorage.clear('token');
            setErrorState({ password: err.responseText });
        });
    }

    return (
        <Grommet theme={customTheme}>
            <Box justify='center' align='center'>

            <Form errors={errorState} onSubmit={handleSubmit} value={signInFormState}>
                <FormField name='userName' htmlFor='sign-up-username' label='Username' required>
                    <TextInput
                        id='sign-up-username'
                        name='userName'
                        onChange={handleInput}
                        value={signInFormState.userName}
                        placeholder='Username' />
                </FormField>
                <FormField required validate={validatePassword}
                    name='password'
                    htmlFor='password'
                    label='Password'>
                    <TextInput
                        id='password'
                        name='password'
                        type='password'
                        placeholder='Must be at least 8 characters long.'
                        onChange={handleInput}
                        value={signInFormState.password} />
                </FormField>
                {errorState &&
                    (<Box pad={{ horizontal: 'small' }}>
                        <Text color="status-error">Incorrect username or password.</Text>
                    </Box>)
                }
                <Box align='center'>
                    <Box align='center'>
                        <Button primary size='large' type='submit' label='Sign In' />
                    </Box>

                    <Box
                        margin={{ top: 'medium' }}
                        round='small' 
                        pad='small' 
                        background='rgba(212,212,212,1)'
                        align='center'
                        width='80%'
                    > 
                        <Text>
                            Are you here to demo this application? <Anchor onClick={handleGuestSignIn}>Click here</Anchor> to sign in with a guest account.
                        </Text>
                    </Box>
                </Box>
            </Form>
            </Box>
        </Grommet>
    )
}
