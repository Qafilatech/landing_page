import React, { useState, useEffect, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// TODO: Import actual UI components e.g. from '../components/ui'
// import { Input } from '../components/ui/input';
// import { Button } from '../components/ui/button';
// TODO: Import toast notification hook e.g. from '../components/ui/use-toast'
// import { useToast } from '../components/ui/use-toast';

const ActivateAccount: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // const { toast } = useToast(); // TODO: Uncomment when useToast is available

    const [token, setToken] = useState<string | null>(null);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setMessage('Activation token not found in URL. Please check the link.');
            // TODO: Show error toast
            // toast({ title: 'Error', description: 'Activation token not found.', variant: 'destructive' });
        }
    }, [searchParams /*, toast*/]); // TODO: Add toast to dependency array if used

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null); // Clear previous messages

        if (!token) {
            setMessage('No activation token available. Cannot proceed.');
            // TODO: Show error toast
            // toast({ title: 'Error', description: 'No activation token.', variant: 'destructive' });
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            // TODO: Show error toast
            // toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
            return;
        }

        if (password.length < 8) { // Example basic validation
            setMessage('Password must be at least 8 characters long.');
            // TODO: Show error toast
            // toast({ title: 'Error', description: 'Password too short.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/users/activate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password set successfully! Redirecting to login...');
                // TODO: Show success toast
                // toast({ title: 'Success', description: 'Password set. Redirecting...' });
                setTimeout(() => {
                    navigate('/auth'); // Assuming '/auth' is your login route
                }, 3000);
            } else {
                setMessage(data.message || 'An error occurred. Please try again.');
                // TODO: Show error toast
                // toast({ title: 'Error', description: data.message || 'Failed to set password.', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Activation error:', error);
            setMessage('An unexpected error occurred. Please check your connection or try again later.');
            // TODO: Show error toast
            // toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Activate Your Account</h2>
            <p>Please set your password to activate your account.</p>
            {token ? (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password">New Password:</label>
                        {/* TODO: Replace with <Input /> component */}
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        {/* TODO: Replace with <Input /> component */}
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    {/* TODO: Replace with <Button /> component */}
                    <button
                        type="submit"
                        disabled={isLoading || !token}
                        style={{ width: '100%', padding: '10px', backgroundColor: isLoading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {isLoading ? 'Setting Password...' : 'Set Password'}
                    </button>
                </form>
            ) : (
                <p>Loading token or token is invalid...</p>
            )}
            {message && (
                <p style={{ marginTop: '20px', color: message.startsWith('Password set successfully') ? 'green' : 'red' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default ActivateAccount;
