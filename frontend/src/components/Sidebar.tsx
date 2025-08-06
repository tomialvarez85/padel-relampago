import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'Torneos', href: '/torneos', current: location.pathname === '/torneos' },
    { name: 'Crear Torneo', href: '/torneos/create', current: location.pathname === '/torneos/create' },
  ]

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-gray-900">Pádel Relámpago</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                item.current
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group border-l-4 py-2 px-3 flex items-center text-sm font-medium`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar 