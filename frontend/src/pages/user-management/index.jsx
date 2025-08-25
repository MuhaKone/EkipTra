import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import { RoleProvider, useRole } from '../../components/ui/RoleBasedMenuFilter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';

// Import components
import UserTable from './components/UserTable';
import UserFilters from './components/UserFilters';
import UserForm from './components/UserForm';
import UserActivityModal from './components/UserActivityModal';
import BulkActionsBar from './components/BulkActionsBar';
import UserStats from './components/UserStats';

const UserManagementContent = () => {
  const navigate = useNavigate();
  const { userRole } = useRole();
  
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedUserForActivity, setSelectedUserForActivity] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showStats, setShowStats] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      fullName: 'Marie Dubois',
      email: 'marie.dubois@equiptracker.fr',
      phone: '+33 1 23 45 67 89',
      role: 'Administrateur',
      department: 'Administration',
      status: 'Actif',
      lastLogin: '2025-01-25T09:15:32',
      createdAt: '2024-12-01T10:00:00',
      permissions: ['dashboard.view', 'equipment.create', 'equipment.edit', 'equipment.delete', 'users.create', 'users.edit', 'users.delete', 'reports.view', 'reports.export', 'system.admin']
    },
    {
      id: 2,
      username: 'hse.manager',
      fullName: 'Pierre Martin',
      email: 'pierre.martin@equiptracker.fr',
      phone: '+33 1 23 45 67 90',
      role: 'Gestionnaire HSE',
      department: 'HSE',
      status: 'Actif',
      lastLogin: '2025-01-25T08:30:15',
      createdAt: '2024-12-05T14:30:00',
      permissions: ['dashboard.view', 'equipment.view', 'equipment.edit', 'equipment.safety', 'users.view', 'users.edit', 'reports.view', 'reports.export', 'compliance.manage']
    },
    {
      id: 3,
      username: 'tech.maintenance',
      fullName: 'Jean Dupont',
      email: 'jean.dupont@equiptracker.fr',
      phone: '+33 1 23 45 67 91',
      role: 'Technicien',
      department: 'Maintenance',
      status: 'Actif',
      lastLogin: '2025-01-24T17:45:22',
      createdAt: '2024-12-10T09:15:00',
      permissions: ['dashboard.view', 'equipment.view', 'equipment.edit', 'equipment.maintenance', 'reports.view']
    },
    {
      id: 4,
      username: 'employee.prod',
      fullName: 'Sophie Leroy',
      email: 'sophie.leroy@equiptracker.fr',
      phone: '+33 1 23 45 67 92',
      role: 'Employé',
      department: 'Production',
      status: 'Actif',
      lastLogin: '2025-01-24T16:20:10',
      createdAt: '2024-12-15T11:45:00',
      permissions: ['dashboard.view', 'equipment.view', 'equipment.borrow', 'equipment.return']
    },
    {
      id: 5,
      username: 'tech.qualite',
      fullName: 'Luc Bernard',
      email: 'luc.bernard@equiptracker.fr',
      phone: '+33 1 23 45 67 93',
      role: 'Technicien',
      department: 'Qualité',
      status: 'Inactif',
      lastLogin: '2025-01-20T14:30:00',
      createdAt: '2024-12-20T08:00:00',
      permissions: ['dashboard.view', 'equipment.view', 'equipment.edit', 'equipment.maintenance', 'reports.view']
    },
    {
      id: 6,
      username: 'employee.log',
      fullName: 'Anne Moreau',
      email: 'anne.moreau@equiptracker.fr',
      phone: '+33 1 23 45 67 94',
      role: 'Employé',
      department: 'Logistique',
      status: 'Suspendu',
      lastLogin: '2025-01-18T10:15:30',
      createdAt: '2024-12-25T13:20:00',
      permissions: ['dashboard.view', 'equipment.view', 'equipment.borrow', 'equipment.return']
    }
  ]);

  // Check authentication and permissions
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Check if user has permission to access user management
    if (!['Administrateur', 'Gestionnaire HSE']?.includes(userRole)) {
      navigate('/dashboard');
      return;
    }
  }, [navigate, userRole]);

  // Filter users based on search and filters
  const filteredUsers = users?.filter(user => {
    const matchesSearch = !searchTerm || 
      user?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      user?.username?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesRole = !selectedRole || user?.role === selectedRole;
    const matchesDepartment = !selectedDepartment || user?.department === selectedDepartment;
    const matchesStatus = !selectedStatus || user?.status === selectedStatus;

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  // Handle user selection
  const handleUserSelect = (userId, isSelected) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, users?.find(u => u?.id === userId)]);
    } else {
      setSelectedUsers(prev => prev?.filter(u => u?.id !== userId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedUsers(filteredUsers);
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle user actions
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleViewActivity = (user) => {
    setSelectedUserForActivity(user);
    setShowActivityModal(true);
  };

  const handleResetPassword = (user) => {
    // Mock password reset
    alert(`Mot de passe réinitialisé pour ${user?.fullName}. Un email a été envoyé.`);
  };

  const handleToggleStatus = (user) => {
    const newStatus = user?.status === 'Actif' ? 'Inactif' : 'Actif';
    setUsers(prev => prev?.map(u => 
      u?.id === user?.id ? { ...u, status: newStatus } : u
    ));
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev?.map(u => 
        u?.id === editingUser?.id ? { ...userData, id: editingUser?.id } : u
      ));
    } else {
      // Add new user
      setUsers(prev => [...prev, { ...userData, id: Date.now() }]);
    }
    
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleBulkAction = (action, selectedUsers) => {
    switch (action) {
      case 'activate':
        setUsers(prev => prev?.map(u => 
          selectedUsers?.find(su => su?.id === u?.id) ? { ...u, status: 'Actif' } : u
        ));
        break;
      case 'deactivate':
        setUsers(prev => prev?.map(u => 
          selectedUsers?.find(su => su?.id === u?.id) ? { ...u, status: 'Inactif' } : u
        ));
        break;
      case 'suspend':
        setUsers(prev => prev?.map(u => 
          selectedUsers?.find(su => su?.id === u?.id) ? { ...u, status: 'Suspendu' } : u
        ));
        break;
      case 'reset-password':
        alert(`Mots de passe réinitialisés pour ${selectedUsers?.length} utilisateur(s)`);
        break;
      case 'export':
        // Mock export functionality
        const csvData = selectedUsers?.map(u => 
          `${u?.fullName},${u?.email},${u?.role},${u?.department},${u?.status}`
        )?.join('\n');
        console.log('Export CSV:', csvData);
        break;
    }
    setSelectedUsers([]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedDepartment('');
    setSelectedStatus('');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
        userRole={userRole}
      />
      <PrimaryNavigation 
        isCollapsed={isMenuCollapsed}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userRole={userRole}
      />
      <main className={`pt-16 transition-smooth ${isMenuCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <BreadcrumbNavigation />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Icon name="Users" size={28} className="mr-3" />
                Gestion des utilisateurs
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez les comptes utilisateurs, rôles et permissions
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowStats(!showStats)}
                iconName={showStats ? "EyeOff" : "Eye"}
                iconPosition="left"
              >
                {showStats ? 'Masquer stats' : 'Afficher stats'}
              </Button>
              
              {userRole === 'Administrateur' && (
                <Button
                  variant="default"
                  onClick={() => {
                    setEditingUser(null);
                    setShowUserForm(true);
                  }}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Nouvel utilisateur
                </Button>
              )}
            </div>
          </div>

          {/* Statistics */}
          {showStats && (
            <UserStats users={users} />
          )}

          {/* Filters */}
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Actions */}
          <BulkActionsBar
            selectedUsers={selectedUsers}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedUsers([])}
          />

          {/* Users Table */}
          <div className="bg-card rounded-lg border border-border shadow-industrial-sm">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    indeterminate={selectedUsers?.length > 0 && selectedUsers?.length < filteredUsers?.length}
                    onChange={(e) => handleSelectAll(e?.target?.checked)}
                    label={`Sélectionner tout (${filteredUsers?.length})`}
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {filteredUsers?.length} utilisateur(s) trouvé(s)
                </div>
              </div>
            </div>

            <UserTable
              users={filteredUsers?.map(user => ({
                ...user,
                isSelected: selectedUsers?.some(su => su?.id === user?.id)
              }))}
              onEditUser={handleEditUser}
              onViewActivity={handleViewActivity}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus}
              onUserSelect={handleUserSelect}
            />
          </div>
        </div>
      </main>
      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <UserForm
              user={editingUser}
              onSave={handleSaveUser}
              onCancel={() => {
                setShowUserForm(false);
                setEditingUser(null);
              }}
              isEditing={!!editingUser}
            />
          </div>
        </div>
      )}
      {/* Activity Modal */}
      <UserActivityModal
        user={selectedUserForActivity}
        isOpen={showActivityModal}
        onClose={() => {
          setShowActivityModal(false);
          setSelectedUserForActivity(null);
        }}
      />
    </div>
  );
};

const UserManagement = () => {
  return (
    <RoleProvider>
      <UserManagementContent />
    </RoleProvider>
  );
};

export default UserManagement;