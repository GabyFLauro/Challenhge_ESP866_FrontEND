/**
 * @deprecated Este tipo está sendo substituído por User do auth.ts
 * Use User com role: 'doctor' em vez deste tipo
 */
export type Doctor = {
    id: string;
    name: string;
    specialty: string;
    image: string;
};