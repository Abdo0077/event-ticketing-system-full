import React from 'react';
import DefaultAvatar from './DefaultAvatar';
import HighlightText from './HighlightText';
import { useAuth } from '../auth/AuthContext';

const UserRow = ({ 
  user, 
  validRoles, 
  onRoleUpdate, 
  onDelete, 
  updateLoading,
  searchQuery 
}) => {
  const { user: currentUser } = useAuth();
  const isCurrentUser = currentUser._id === user._id;

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <DefaultAvatar 
              name={user.name}
              profilePicture={user.profilePicture}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              <HighlightText text={user.name} highlight={searchQuery} />
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${user.role === 'System Admin' ? 'bg-purple-100 text-purple-800' : 
            user.role === 'Organizer' ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'}`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={user.role}
          onChange={(e) => onRoleUpdate(user._id, e.target.value)}
          disabled={updateLoading === user._id || isCurrentUser}
        >
          {validRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        {updateLoading === user._id && (
          <div className="mt-1 text-xs text-gray-500">Updating...</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {!isCurrentUser ? (
          <button 
            onClick={() => onDelete(user._id)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        ) : (
          <span className="text-gray-400 italic text-xs">Current User</span>
        )}
      </td>
    </>
  );
};

export default UserRow; 