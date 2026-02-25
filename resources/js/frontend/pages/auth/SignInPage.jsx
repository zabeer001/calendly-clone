import React, { useState } from 'react';
import { apiRequest, setAccessToken, setRole } from '../../../shared/apiClient';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const payload = await apiRequest('/api/signin', {
                method: 'POST',
                body: {
                    email,
                    password,
                    remember_me: rememberMe,
                },
            });

            const accessToken = payload?.data?.access_token;
            const user = payload?.data?.user;

            setAccessToken(accessToken);
            setRole(user?.role);

            setMessage(payload?.message || 'Signed in successfully.');
            window.location.href = '/dashbaord';
        } catch (error) {
            if (error?.status === 422 && error?.payload?.errors) {
                const firstError = Object.values(error.payload.errors)?.[0]?.[0];
                setMessage(firstError || 'Validation failed.');
            } else if (error?.status === 401 || error?.status === 400) {
                setMessage(error?.message || 'Authentication failed. Please check your credentials.');
            } else {
                setMessage('Could not connect to the server. Please try again.');
            }

            setPassword('');
        } finally {
            setIsLoading(false);
        }
    };

    const isSuccess = message.toLowerCase().includes('success');

    return (
        <section className="mx-auto mt-20 max-w-md">
                <div className="card border border-base-300/60 bg-base-100/80 shadow-2xl backdrop-blur-lg">
                    <div className="card-body p-8 sm:p-10">
                        <div className="mb-4 text-center">
                            <div className="badge badge-success badge-outline mb-4 p-4 text-xs font-medium">
                                Secure access
                            </div>
                            <h1 className="bg-gradient-to-r from-success to-emerald-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
                                Welcome Back
                            </h1>
                            <p className="mt-2 text-base-content/70">Sign in to your account to continue</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {message ? (
                                <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'} text-sm`} role="alert">
                                    <span>{message}</span>
                                </div>
                            ) : null}

                            <div className="form-control">
                                <label htmlFor="email" className="label">
                                    <span className="label-text font-medium">Email address</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="password" className="label">
                                    <span className="label-text font-medium">Password</span>
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="label cursor-pointer gap-2 p-0">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={isLoading}
                                        className="checkbox checkbox-sm checkbox-success"
                                    />
                                    <span className="label-text text-base-content/80">Remember me</span>
                                </label>
                                <a
                                    href="#"
                                    className={`link link-hover text-base-content/80 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-success w-full shadow-lg shadow-green-500/25"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-base-content/70">
                            Don&apos;t have an account?{' '}
                            <a
                                href="#"
                                className={`link link-hover font-semibold text-success ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Sign up
                            </a>
                        </div>
                    </div>
                </div>
        </section>
    );
}

export default SignInPage;
