import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, TextStyle, ViewStyle } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import styled from 'styled-components/native';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';
import { RootStackParamList } from '../../types/navigation';
import { styles } from './styles';
import { appointmentsService, Appointment } from '../../services/appointments';
import { StyledProps } from './interfaces/stylesprops';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';

type DoctorDashboardScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorDashboard'>;
};

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

const DoctorDashboardScreen: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigation = useNavigation<DoctorDashboardScreenProps['navigation']>();
    const { appointments, loading, load, updateStatus } = useDoctorDashboard(user?.id);

    // Carrega as consultas quando a tela estiver em foco
    useFocusEffect(
        React.useCallback(() => {
            load();
        }, [load])
    );

    return (
        <Container>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Title>Minhas Consultas</Title>

                <Button
                    title="Meu Perfil"
                    onPress={() => navigation.navigate('Profile')}
                    containerStyle={styles.button as ViewStyle}
                    buttonStyle={styles.buttonStyle}
                />

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
                                <StatusBadge status={appointment.status}>
                                    <StatusText status={appointment.status}>
                                        {getStatusText(appointment.status)}
                                    </StatusText>
                                </StatusBadge>
                                {appointment.status === 'pending' && (
                                    <ButtonContainer>
                                        <Button
                                            title="Confirmar"
                                            onPress={() => updateStatus(appointment.id, 'confirmed')}
                                            containerStyle={styles.actionButton as ViewStyle}
                                            buttonStyle={styles.confirmButton}
                                        />
                                        <Button
                                            title="Cancelar"
                                            onPress={() => updateStatus(appointment.id, 'cancelled')}
                                            containerStyle={styles.actionButton as ViewStyle}
                                            buttonStyle={styles.cancelButton}
                                        />
                                    </ButtonContainer>
                                )}
                            </ListItem.Content>
                        </AppointmentCard>
                    ))
                )}

                <Button
                    title="Sair"
                    onPress={signOut}
                    containerStyle={styles.button as ViewStyle}
                    buttonStyle={styles.logoutButton}
                />
            </ScrollView>
        </Container>
    );
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
`;

const AppointmentCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
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

export default DoctorDashboardScreen;