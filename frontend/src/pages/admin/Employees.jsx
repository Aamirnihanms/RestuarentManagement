import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  UserCog,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react';
import { getAllEmployeesData, registerEmployee, softDeleteUserData, restoreUserData } from '../../api/dashboardApi';
import toast from 'react-hot-toast';

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'delete', loading }) => {
  if (!isOpen) return null;

  const isDelete = type === 'delete';
  const buttonColor = isDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const iconColor = isDelete ? 'text-red-600' : 'text-green-600';
  const bgColor = isDelete ? 'bg-red-50' : 'bg-green-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`${bgColor} p-3 rounded-full`}>
              {isDelete ? (
                <AlertTriangle className={`w-6 h-6 ${iconColor}`} />
              ) : (
                <CheckCircle className={`w-6 h-6 ${iconColor}`} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${buttonColor}`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </span>
            ) : (
              isDelete ? 'Disable Employee' : 'Restore Employee'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Employee Details View Modal
const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Employee Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Employee Profile Section */}
          <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">{employee.name}</h4>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-1" />
                {employee.email}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {employee.isDeleted ? (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Deleted</span>
              ) : employee.isActive ? (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
              ) : (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>
              )}
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                employee.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                employee.role === 'moderator' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
              </span>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Employee ID</p>
                <p className="text-sm font-medium text-gray-900">{employee._id}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Joined Date</p>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(employee.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(employee.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Account Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {employee.isDeleted ? 'Deleted' : employee.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end rounded-b-xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Employee Modal
const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await registerEmployee(formData);
      toast.success('Employee added successfully');
      setFormData({ name: '', email: '', password: '' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error(error.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="bg-emerald-600 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center">
              <UserCog className="w-6 h-6 mr-2" />
              Add New Employee
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </span>
              ) : (
                'Add Employee'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewModal, setViewModal] = useState({ isOpen: false, employee: null });
  const [addModal, setAddModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employee: null });
  const [restoreModal, setRestoreModal] = useState({ isOpen: false, employee: null });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, statusFilter, roleFilter, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployeesData();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (employee) => {
    setViewModal({ isOpen: true, employee });
  };

  const closeViewModal = () => {
    setViewModal({ isOpen: false, employee: null });
  };

  const openDeleteModal = (employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, employee: null });
  };

  const openRestoreModal = (employee) => {
    setRestoreModal({ isOpen: true, employee });
  };

  const closeRestoreModal = () => {
    setRestoreModal({ isOpen: false, employee: null });
  };

  const handleDeleteEmployee = async () => {
    try {
      setDeleteLoading(true);
      await softDeleteUserData(deleteModal.employee._id);
      toast.success('Employee disabled successfully');
      await fetchEmployees();
      closeDeleteModal();
    } catch (error) {
      toast.error('Failed to disable employee. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestoreEmployee = async () => {
    try {
      setRestoreLoading(true);
      await restoreUserData(restoreModal.employee._id);
      toast.success('Employee restored successfully');
      await fetchEmployees();
      closeRestoreModal();
    } catch (error) {
      console.error('Error restoring employee:', error);
      toast.error('Failed to restore employee. Please try again.');
    } finally {
      setRestoreLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(employee => {
        if (statusFilter === 'active') return employee.isActive && !employee.isDeleted;
        if (statusFilter === 'inactive') return !employee.isActive;
        if (statusFilter === 'deleted') return employee.isDeleted;
        return true;
      });
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(employee => employee.role === roleFilter);
    }

    setFilteredEmployees(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (employee) => {
    if (employee.isDeleted) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Deleted</span>;
    }
    if (employee.isActive) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      moderator: 'bg-orange-100 text-orange-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[role] || colors.moderator}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const stats = [
    {
      label: 'Total Employees',
      value: employees.length,
      icon: UserCog,
      color: 'bg-blue-500'
    },
    {
      label: 'Active Employees',
      value: employees.filter(e => e.isActive && !e.isDeleted).length,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      label: 'Administrators',
      value: employees.filter(e => e.role === 'admin').length,
      icon: Briefcase,
      color: 'bg-purple-500'
    },
    {
      label: 'Moderators',
      value: employees.filter(e => e.role === 'moderator').length,
      icon: UserCog,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Modals */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteEmployee}
        title="Disable Employee Account"
        message={`Are you sure you want to disable ${deleteModal.employee?.name}'s account? This employee will no longer be able to access the system.`}
        type="delete"
        loading={deleteLoading}
      />

      <ConfirmationModal
        isOpen={restoreModal.isOpen}
        onClose={closeRestoreModal}
        onConfirm={handleRestoreEmployee}
        title="Restore Employee Account"
        message={`Are you sure you want to restore ${restoreModal.employee?.name}'s account? This employee will regain access to the system.`}
        type="restore"
        loading={restoreLoading}
      />

      <EmployeeDetailsModal
        isOpen={viewModal.isOpen}
        onClose={closeViewModal}
        employee={viewModal.employee}
      />

      <AddEmployeeModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSuccess={fetchEmployees}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members and staff accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchEmployees}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setAddModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No employees found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-sm flex-shrink-0">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">{employee.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(employee.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(employee.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openViewModal(employee)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-1 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>

                        {employee.isDeleted ? (
                          <button
                            onClick={() => openRestoreModal(employee)}
                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center space-x-1 text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Enable</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => openDeleteModal(employee)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-1 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Disable</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && filteredEmployees.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      )}
    </div>
  );
}