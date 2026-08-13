import React, { useState, FormEvent, useEffect } from 'react';
import { SessionAuth, useSessionContext } from 'supertokens-auth-react/recipe/session';
import { signOut } from 'supertokens-auth-react/recipe/emailpassword';
import { useNavigate } from 'react-router-dom';

// TODO: Import actual UI components if available

const SuperAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const sessionContext = useSessionContext();

    const [companyName, setCompanyName] = useState<string>('');
    const [desiredTenantId, setDesiredTenantId] = useState<string>('');
    const [otherCompanyDetails, setOtherCompanyDetails] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        // Log session state for debugging
        console.log("Dashboard Session Context:", {
            loading: sessionContext.loading,
            sessionExists: !sessionContext.loading && 'userId' in sessionContext,
            userId: !sessionContext.loading && 'userId' in sessionContext ? sessionContext.userId : null,
            accessTokenPayload: !sessionContext.loading && 'accessTokenPayload' in sessionContext ? sessionContext.accessTokenPayload : null
        });

        // If we have a session, verify it's for the superadmin tenant
        if (!sessionContext.loading && 'userId' in sessionContext) {
            const tenantId = sessionContext.accessTokenPayload?.tenantId;
            console.log("Current tenant ID:", tenantId);
            if (tenantId !== "superadmin_tenant") {
                console.log("Not a superadmin session, redirecting to login");
                navigate('/superadmin/login');
            }
        }
    }, [sessionContext, navigate]);

    const handleRegisterCompany = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        if (!companyName.trim() || !desiredTenantId.trim()) {
            setError("Company Name and Desired Tenant ID are required.");
            setIsLoading(false);
            return;
        }

        // Basic validation for tenant ID (e.g., no spaces, lowercase)
        if (/\s/.test(desiredTenantId) || desiredTenantId !== desiredTenantId.toLowerCase()) {
            setError("Desired Tenant ID must be lowercase and contain no spaces.");
            setIsLoading(false);
            return;
        }

        console.log("Attempting to register company:", { companyName, desiredTenantId, otherCompanyDetails });
        // TODO: Make API call to POST /api/superadmin_tenant/companies/create
        // The actual API call would look something like:
        /*
        try {
            const apiResponse = await fetch('/api/superadmin_tenant/companies/create', { // Adjust API path as needed
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName, tenantId: desiredTenantId, details: otherCompanyDetails })
            });
            const data = await apiResponse.json();
            if (!apiResponse.ok) {
                throw new Error(data.message || 'Failed to register company.');
            }
            setSuccessMessage(`Company '${companyName}' registered and tenant '${desiredTenantId}' creation initiated.`);
            setCompanyName('');
            setDesiredTenantId('');
            setOtherCompanyDetails('');
        } catch (err: any) {
            setError(err.message || 'An error occurred during company registration.');
        } finally {
            setIsLoading(false);
        }
        */

        try{
            const apiResponse = await fetch('/api/superadmin_tenant/companies/create',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'applicaiton/json'},
                    body: JSON.stringify({ companyName, tenantId: desiredTenantId, details: otherCompanyDetails})

                }
            );
            const data = await apiResponse.json();
            if (!apiResponse.ok){
                throw new Error(data.message || 'Faile to register compnay.');
            }
            setSuccessMessage(`Company '${companyName}' registered and tenant '${desiredTenantId}' created initiated.`);
            setCompanyName('');
            setDesiredTenantId('');
            setOtherCompanyDetails('');
        } catch (err: any){
            setError(err.message || 'An error ocurred during company registration.')
        } finally {
            setIsLoading(false);
        }

        //TODO DELETE THIS
        // // Simulate API call success for now
        // setTimeout(() => {
        //     setSuccessMessage(`Company '${companyName}' registered and tenant '${desiredTenantId}' creation initiated successfully (SIMULATED).`);
        //     setCompanyName('');
        //     setDesiredTenantId('');
        //     setOtherCompanyDetails('');
        //     setIsLoading(false);
        // }, 1000);

    };

    const handleLogout = async () => {
        await signOut();
        navigate('/superadmin/login'); // Or your desired logout destination
    };

    // Handle session loading state
    if (sessionContext.loading) {
        console.log("Session is still loading...");
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>
                    <h2>Loading Super Admin Dashboard...</h2>
                    <p>Please wait while we verify your session.</p>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!('userId' in sessionContext)) {
        console.log("No session exists, redirecting to login...");
        navigate('/superadmin/login');
        return null;
    }

    return (
        <SessionAuth> {/* Ensures this component is only rendered if a session exists for the superadmin_tenant */}
            <div style={{ padding: '20px', maxWidth: '700px', margin: '40px auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', color: '#333' }}>Super Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '10px 18px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px' }}
                    >
                        Logout
                    </button>
                </div>

                <div style={{ padding: '25px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
                    <h2 style={{ fontSize: '22px', color: '#444', marginBottom: '20px' }}>Register New Company & Tenant</h2>
                    <form onSubmit={handleRegisterCompany}>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="companyName" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Company Name:</label>
                            <input
                                id="companyName"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="desiredTenantId" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Desired SuperTokens Tenant ID:</label>
                            <input
                                id="desiredTenantId"
                                type="text"
                                value={desiredTenantId}
                                onChange={(e) => setDesiredTenantId(e.target.value.toLowerCase().replace(/\s+/g, ''))} // Enforce lowercase and no spaces
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                                placeholder="e.g., acmecorp, Contoso"
                            />
                             <small style={{display: 'block', marginTop: '4px', color: '#777'}}>Must be lowercase, no spaces. This will be part of their URL.</small>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="otherCompanyDetails" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Other Company Details (Optional):</label>
                            <textarea
                                id="otherCompanyDetails"
                                value={otherCompanyDetails}
                                onChange={(e) => setOtherCompanyDetails(e.target.value)}
                                rows={4}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                            />
                        </div>

                        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                        {successMessage && <p style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: isLoading ? '#a0a0a0' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            {isLoading ? 'Registering...' : 'Register Company & Create Tenant'}
                        </button>
                    </form>
                </div>
            </div>
        </SessionAuth>
    );
};

export default SuperAdminDashboard;
