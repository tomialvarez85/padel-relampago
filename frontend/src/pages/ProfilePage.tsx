const ProfilePage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Información del Sistema</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pádel Relámpago</h2>
        <p className="text-gray-600 mb-4">
          Sistema de gestión de torneos de pádel sin autenticación requerida.
        </p>
        
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-900">Versión:</span>
            <span className="ml-2 text-gray-600">1.0.0</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Estado:</span>
            <span className="ml-2 text-green-600">Activo</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Acceso:</span>
            <span className="ml-2 text-gray-600">Público</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 