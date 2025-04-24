import { ConnectionStatus as ConnectionStatusEnum } from "@/types";

interface ConnectionStatusProps {
  status: ConnectionStatusEnum;
}

const ConnectionStatus = ({ status }: ConnectionStatusProps) => {
  const getStatusColor = () => {
    switch (status) {
      case ConnectionStatusEnum.CONNECTED:
        return "bg-success";
      case ConnectionStatusEnum.CONNECTING:
        return "bg-warning animate-pulse";
      case ConnectionStatusEnum.DISCONNECTED:
      default:
        return "bg-error";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ConnectionStatusEnum.CONNECTED:
        return "Connected to Frappe CRM";
      case ConnectionStatusEnum.CONNECTING:
        return "Connecting to Frappe CRM...";
      case ConnectionStatusEnum.DISCONNECTED:
      default:
        return "Not connected to Frappe CRM";
    }
  };

  return (
    <div className="mt-4 md:mt-0 flex items-center">
      <span className={`h-3 w-3 rounded-full ${getStatusColor()} mr-2`} />
      <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
    </div>
  );
};

export default ConnectionStatus;
