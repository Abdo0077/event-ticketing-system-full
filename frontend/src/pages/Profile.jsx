import { useAuth } from '../auth/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DefaultAvatar from '../components/DefaultAvatar';
import UpdateProfileForm from '../components/UpdateProfileForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/users/profile', {
        withCredentials: true,
      });
      console.log('Fetched user details:', response.data);
      if (response.data.success && response.data.user) {
        setUserDetails(response.data.user);
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      console.error('Profile error:', err);
      setError(err.response?.data?.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleUpdateProfile = async (updatedUser) => {
    console.log('Handling profile update:', updatedUser);
    setUserDetails(updatedUser);
    setSuccessMessage('Profile updated successfully!');
    setShowSuccess(true);
    setIsEditing(false);
    
    // Refresh user details after update
    await fetchUserDetails();
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handlePasswordChangeSuccess = () => {
    setSuccessMessage('Password changed successfully!');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleDeleteProfile = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete('http://localhost:3000/api/v1/users/profile', {
        withCredentials: true,
      });
      
      // Logout the user
      await logout();
      
      // Show success message and redirect
      setSuccessMessage('Profile deleted successfully. Redirecting...');
      setShowSuccess(true);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError(error.response?.data?.message || 'Failed to delete profile');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white border-l-4 border-red-500 p-6 rounded-xl shadow-lg max-w-lg">
        <p className="text-xl font-semibold text-red-600 mb-2">Error</p>
        <p className="text-gray-700">{error}</p>
      </div>
    </div>
  );

  if (!userDetails) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white border-l-4 border-yellow-400 p-6 rounded-xl shadow-lg max-w-lg">
        <p className="text-lg font-medium text-yellow-800">No user data available</p>
      </div>
    </div>
  );

  return (
    <>
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 flex justify-center z-50">
          <div 
            className="mt-6 bg-green-500 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center space-x-2 
              transform transition-all duration-500 ease-out animate-bounce"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-lg">{successMessage}</span>
          </div>
        </div>
      )}

      {isEditing && (
        <UpdateProfileForm
          userDetails={userDetails}
          onClose={() => setIsEditing(false)}
          onUpdate={handleUpdateProfile}
        />
      )}

      {isChangingPassword && (
        <ChangePasswordForm
          onClose={() => setIsChangingPassword(false)}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Profile</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Profile'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-40 relative">
              <div className="absolute -bottom-12 left-10">
                <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-white">
                  <DefaultAvatar 
                    name={userDetails.name} 
                    profilePicture={userDetails.profilePicture}
                  />
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                    title="Change profile picture"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.536-6.536a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 17H9v-3l6.232-6.232z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-20 pb-10 px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{userDetails.name}</h1>
                  <p className="text-sm text-blue-600 font-medium">{userDetails.role}</p>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
                  <div className="divide-y divide-gray-200 space-y-3">
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-base font-medium text-gray-900">{userDetails.name}</p>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.536-6.536M9 11l4 4" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="text-base font-medium text-gray-900">{userDetails.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Settings */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">System Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="text-base font-medium text-gray-900">{userDetails.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        Active
                      </span>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Password</p>
                          <button 
                            onClick={() => setIsChangingPassword(true)}
                            className="text-blue-600 hover:underline text-sm font-medium"
                          >
                            Change password
                          </button>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <button 
                          onClick={() => setShowDeleteConfirm(true)}
                          className="group flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
                        >
                          <svg 
                            className="w-4 h-4 mr-2 text-gray-400 group-hover:text-red-500 transition-colors duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                            />
                          </svg>
                          Delete account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
