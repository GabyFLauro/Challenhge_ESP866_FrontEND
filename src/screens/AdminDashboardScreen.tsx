import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, TextStyle, ViewStyle, TouchableOpacity } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import styled from 'styled-components/native';
import Header from '../components/Header';
import UserManagement from '../components/UserManagement';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { RootStackParamList } from '../types/navigation';

type AdminDashboardScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    date: string;
    time: string;
    specialty: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'doctor' | 'patient';
}

interface StyledProps {
    status: string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'confirmed':
            return theme.colors.success;
        case 'cancelled':
            return theme.colors.error;
        default:
            return theme.colors.warning;
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'confirmed':
            return 'Confirmada';
        case 'cancelled':
            return 'Cancelada';
        default:
            return 'Pendente';
    }
};

const AdminDashboardScreen: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigation = useNavigation<AdminDashboardScreenProps['navigation']>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'appointments' | 'users'>('appointments');

    const loadData = async () => {
        try {
            // Carrega consultas
            const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
            if (storedAppointments) {
                const allAppointments: Appointment[] = JSON.parse(storedAppointments);
                setAppointments(allAppointments);
            }

            // Carrega usuários
            const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
            if (storedUsers) {
                const allUsers: User[] = JSON.parse(storedUsers);
                setUsers(allUsers);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    // Carrega os dados quando a tela estiver em foco
    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
        try {
            const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
            if (storedAppointments) {
                const allAppointments: Appointment[] = JSON.parse(storedAppointments);
                const updatedAppointments = allAppointments.map(appointment => {
                    if (appointment.id === appointmentId) {
                        return { ...appointment, status: newStatus };
                    }
                    return appointment;
                });
                await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));
                loadData(); // Recarrega os dados
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const renderContent = () => {
        if (activeTab === 'appointments') {
            return (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Title>Consultas Agendadas</Title>
                    
                    {loading ? (
                        <LoadingText>Carregando consultas...</LoadingText>
                    ) : appointments.length === 0 ? (
                        <EmptyText>Nenhuma consulta agendada</EmptyText>
                    ) : (
                        appointments.map((appointment) => (
                            <AppointmentCard key={appointment.id}>
                                <ListItem.Content>
                                    <ListItem.Title style={styles.dateTime as TextStyle}>
                                        {appointment.date} às {appointment.time}
                                    </ListItem.Title>
                                    <ListItem.Subtitle style={styles.doctorInfo}>
                                        Dr(a). {appointment.doctorName} - {appointment.specialty}
                                    </ListItem.Subtitle>
                                    <StatusBadge status={appointment.status}>
                                        <StatusText status={appointment.status}>
                                            {getStatusText(appointment.status)}
                                        </StatusText>
                                    </StatusBadge>
                                    {appointment.status === 'pending' && (
                                        <ButtonContainer>
                                            <Button
                                                title="Confirmar"
                                                onPress={() => handleUpdateStatus(appointment.id, 'confirmed')}
                                                containerStyle={styles.actionButton as ViewStyle}
                                                buttonStyle={styles.confirmButton}
                                            />
                                            <Button
                                                title="Cancelar"
                                                onPress={() => handleUpdateStatus(appointment.id, 'cancelled')}
                                                containerStyle={styles.actionButton as ViewStyle}
                                                buttonStyle={styles.cancelButton}
                                            />
                                        </ButtonContainer>
                                    )}
                                </ListItem.Content>
                            </AppointmentCard>
                        ))
                    )}
                </ScrollView>
            );
        } else {
            return <UserManagement style={{ flex: 1 }} />;
        }
    };

    return (
        <Container>
            <Header />
            <Title>Painel Administrativo</Title>
            
            <TabContainer>
                <TabButton
                    active={activeTab === 'appointments'}
                    onPress={() => setActiveTab('appointments')}
                >
                    <TabButtonText active={activeTab === 'appointments'}>
                        Consultas
                    </TabButtonText>
                </TabButton>
                <TabButton
                    active={activeTab === 'users'}
                    onPress={() => setActiveTab('users')}
                >
                    <TabButtonText active={activeTab === 'users'}>
                        Usuários
                    </TabButtonText>
                </TabButton>
            </TabContainer>

            {renderContent()}

            <Button
                title="Sair"
                onPress={signOut}
                containerStyle={styles.logoutButton as ViewStyle}
                buttonStyle={styles.logoutButtonStyle}
            />
        </Container>
    );
};

const styles = {
    scrollContent: {
        padding: 20,
    },
    button: {
        marginBottom: 20,
        width: '100%',
    },
    buttonStyle: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
    },
    logoutButton: {
        backgroundColor: theme.colors.error,
        paddingVertical: 12,
    },
    actionButton: {
        marginTop: 8,
        width: '48%',
    },
    confirmButton: {
        backgroundColor: theme.colors.success,
        paddingVertical: 8,
    },
    cancelButton: {
        backgroundColor: theme.colors.error,
        paddingVertical: 8,
    },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
  padding: 16px;
`;

const TabContainer = styled.View`
  flex-direction: row;
  background-color: ${theme.colors.white};
  margin: 0 16px 16px 16px;
  border-radius: 8px;
  padding: 4px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const TabButton = styled(TouchableOpacity)<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  background-color: ${(props: { active: boolean }) => 
    props.active ? theme.colors.primary : 'transparent'};
  align-items: center;
`;

const TabButtonText = styled.Text<{ active: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props: { active: boolean }) => 
    props.active ? theme.colors.white : theme.colors.text};
`;

const AppointmentCard = styled(ListItem)`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

export default AdminDashboardScreen; 