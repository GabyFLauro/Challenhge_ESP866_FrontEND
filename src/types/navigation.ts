/**
 * Tipos relacionados à navegação
 * Este arquivo contém todas as definições de tipos necessárias para a navegação entre telas
 */
/**
 * Define as rotas disponíveis na aplicação e seus parâmetros
 * @property Login - Tela de login
 * @property Register - Tela de registro
 * @property Home - Tela inicial da aplicação
 * @property Sensors - Tela de sensores
 * @property SensorDetail - Tela de detalhes de um sensor
 * @property AccountSettings - Tela de configurações da conta
 * @property DrawerNavigator - Navegador de gaveta
 */
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Sensors: undefined;
    SensorDetail: { sensorId: string };
    Realtime: undefined;
    Metric: { keyName: string; title?: string; unit?: string };
    AccountSettings: undefined;
    DrawerNavigator: undefined;
};