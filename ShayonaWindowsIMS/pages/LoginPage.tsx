
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { USER_ROLES } from '../constants';

const LoginPage: React.FC = () => {
    const [name, setName] = useState('Demo User');
    const [role, setRole] = useState<UserRole>('Admin');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(name, role);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2 text-primary-600 dark:text-primary-400">UPVC Pro ERP</h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Login to your account</p>
                <form onSubmit={handleLogin} className="space-y-6">
                    <Input 
                        label="Name" 
                        id="name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                    <Select label="Role" id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                        {USER_ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </Select>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
