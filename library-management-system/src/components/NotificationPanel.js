// NotificationPanel.js - Dropdown Panel for Notifications
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    Menu,
    MenuItem,
    Box,
    Typography,
    IconButton,
    Divider,
    ListItemIcon,
    Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BookIcon from '@mui/icons-material/Book';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AuthContext from '../context/AuthContext';

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 12,
        marginTop: theme.spacing(1),
        minWidth: 360,
        maxWidth: 400,
        maxHeight: 500,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    },
}));

const NotificationItem = styled(MenuItem)(({ theme, isRead }) => ({
    padding: theme.spacing(2),
    borderRadius: 8,
    margin: theme.spacing(0.5, 1),
    backgroundColor: isRead ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
    '&:hover': {
        backgroundColor: isRead ? 'rgba(0,0,0,0.04)' : 'rgba(25, 118, 210, 0.12)',
    },
}));

const NotificationPanel = ({ anchorEl, open, onClose }) => {
    const { currentUser } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ FIX: Wrap in useCallback so useEffect can depend on it safely
    const fetchNotifications = useCallback(async () => {
        if (!currentUser?.id) return;

        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/notifications/user/${currentUser.id}`
            );
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUser?.id]);

    // 🔥 No ESLint warnings, clean and correct
    useEffect(() => {
        if (open && currentUser) {
            fetchNotifications();
        }
    }, [open, currentUser, fetchNotifications]);

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
                method: 'PUT',
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await fetch(`http://localhost:8080/api/notifications/${notificationId}`, {
                method: 'DELETE',
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!currentUser?.id) return;

        try {
            await fetch(
                `http://localhost:8080/api/notifications/user/${currentUser.id}/read-all`,
                { method: 'PUT' }
            );
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const clearAll = async () => {
        if (!currentUser?.id) return;

        try {
            await fetch(
                `http://localhost:8080/api/notifications/user/${currentUser.id}/clear`,
                { method: 'DELETE' }
            );
            fetchNotifications();
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'BOOK_ISSUED':
                return <BookIcon color="primary" />;
            case 'BOOK_RETURNED':
                return <AssignmentReturnIcon color="success" />;
            case 'BOOK_OVERDUE':
                return <WarningIcon color="warning" />;
            case 'RESERVATION_READY':
                return <CheckCircleIcon color="success" />;
            default:
                return <BookIcon />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <StyledMenu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            {/* Header */}
            <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Notifications
                    {unreadCount > 0 && (
                        <Chip
                            label={unreadCount}
                            size="small"
                            color="primary"
                            sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                        />
                    )}
                </Typography>
                {notifications.length > 0 && (
                    <Box>
                        {unreadCount > 0 && (
                            <IconButton size="small" onClick={markAllAsRead} title="Mark all as read">
                                <DoneAllIcon fontSize="small" />
                            </IconButton>
                        )}
                        <IconButton size="small" onClick={clearAll} title="Clear all">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Box>

            <Divider />

            {/* Notifications List */}
            {loading ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">Loading...</Typography>
                </Box>
            ) : notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">No notifications</Typography>
                </Box>
            ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            isRead={notification.isRead}
                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                        >
                            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {getNotificationIcon(notification.type)}
                                </ListItemIcon>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: notification.isRead ? 400 : 600,
                                            mb: 0.5,
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {notification.message}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(notification.createdAt)}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                    }}
                                    sx={{ alignSelf: 'flex-start' }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </NotificationItem>
                    ))}
                </Box>
            )}
        </StyledMenu>
    );
};

export default NotificationPanel;
