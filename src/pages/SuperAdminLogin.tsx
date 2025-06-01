import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from 'supertokens-auth-react/recipe/emailpassword';

// TODO: Import actual UI components if available (Input, Button, etc.)
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';

const superAdminTenantId = "superadmin_tenant"; // As defined in previous steps

const SuperAdminLogin: React.FC = () => {
    const navigate = useNavigate();
    // const { toast } = useToast(); // TODO: Uncomment if using a toast library

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSuperAdminLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await signIn({
                formFields: [
                    { id: "email", value: email },
                    { id: "password", value: password }
                ],
                userContext: {
                    tenantId: superAdminTenantId
                }
            });

            if (response.status === "OK") {
                // Successful login
                // TODO: Show success toast if available
                // toast({ title: 'Success', description: 'Super admin login successful.' });
                navigate('/superadmin/dashboard'); // Navigate to a placeholder super admin dashboard
            } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
                setError("Incorrect email or password.");
                // TODO: Show error toast if available
                // toast({ title: 'Error', description: 'Incorrect email or password.', variant: 'destructive' });
            } else {
                // Handle other errors like "SIGN_IN_NOT_ALLOWED", etc.
                setError("An unexpected error occurred. Please try again.");
                // TODO: Show error toast if available
                // toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
                console.error("Super admin sign in error:", response);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during login.");
            // TODO: Show error toast if available
            // toast({ title: 'Error', description: err.message || 'Login failed.', variant: 'destructive' });
            console.error("Super admin sign in exception:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '24px', color: '#333' }}>Super Admin Login</h2>
            <form onSubmit={handleSuperAdminLogin}>
                <div style={{ marginBottom: '20px' }}>
                    <label
                        htmlFor="email"
                        style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}
                    >
                        Email:
                    </label>
                    {/* TODO: Replace with <Input /> component */}
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        placeholder="admin@example.com"
                    />
                </div>
                <div style={{ marginBottom: '25px' }}>
                    <label
                        htmlFor="password"
                        style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}
                    >
                        Password:
                    </label>
                    {/* TODO: Replace with <Input /> component */}
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        placeholder="••••••••"
                    />
                </div>
                {error && (
                    <p style={{ color: 'red', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>
                        {error}
                    </p>
                )}
                {/* TODO: Replace with <Button /> component */}
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: isLoading ? '#a0a0a0' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default SuperAdminLogin;
