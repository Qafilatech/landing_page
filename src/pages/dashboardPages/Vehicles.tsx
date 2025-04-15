import React, { useState } from 'react';
import { SearchIcon, Filter, MapPin, CheckCircle, XCircle, CarIcon, BusIcon, TruckIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// Mock data for vehicles
const vehiclesList = [
  {
    id: 'VEH001',
    type: 'Car',
    model: 'Honda Civic',
    licensePlate: 'ABC123',
    driverId: 'DRV001',
    driverName: 'John Smith',
    status: 'Active',
    lastMaintenance: '2023-09-15',
    currentLocation: { lat: 40.7128, lng: -74.006 },
    fuelLevel: '75%',
    totalDeliveries: 128,
    deliveriesToday: 5,
    metrics: {
      avgFuelConsumption: '8.5L/100km',
      totalDistance: '25,430 km',
      nextServiceDue: '1,570 km'
    }
  },
  {
    id: 'VEH002',
    type: 'Truck',
    model: 'Ford Transit',
    licensePlate: 'XYZ789',
    driverId: 'DRV002',
    driverName: 'Sarah Johnson',
    status: 'Active',
    lastMaintenance: '2023-10-02',
    currentLocation: { lat: 40.7282, lng: -73.794 },
    fuelLevel: '60%',
    totalDeliveries: 95,
    deliveriesToday: 3,
    metrics: {
      avgFuelConsumption: '12.3L/100km',
      totalDistance: '18,750 km',
      nextServiceDue: '3,250 km'
    }
  },
  {
    id: 'VEH003',
    type: 'Motorcycle',
    model: 'Yamaha YZF',
    licensePlate: 'DEF456',
    driverId: 'DRV003',
    driverName: 'Michael Rodriguez',
    status: 'Maintenance',
    lastMaintenance: '2023-10-12',
    currentLocation: null,
    fuelLevel: '100%',
    totalDeliveries: 156,
    deliveriesToday: 0,
    metrics: {
      avgFuelConsumption: '4.2L/100km',
      totalDistance: '12,380 km',
      nextServiceDue: 'In Progress'
    }
  },
  {
    id: 'VEH004',
    type: 'Car',
    model: 'Toyota Prius',
    licensePlate: 'GHI789',
    driverId: 'DRV004',
    driverName: 'Emily Chen',
    status: 'Active',
    lastMaintenance: '2023-08-25',
    currentLocation: { lat: 40.7589, lng: -73.985 },
    fuelLevel: '85%',
    totalDeliveries: 67,
    deliveriesToday: 4,
    metrics: {
      avgFuelConsumption: '4.5L/100km',
      totalDistance: '15,620 km',
      nextServiceDue: '2,380 km'
    }
  },
  {
    id: 'VEH005',
    type: 'Bus',
    model: 'Mercedes Sprinter',
    licensePlate: 'JKL012',
    driverId: 'DRV005',
    driverName: 'David Wilson',
    status: 'Inactive',
    lastMaintenance: '2023-09-05',
    currentLocation: null,
    fuelLevel: '40%',
    totalDeliveries: 112,
    deliveriesToday: 0,
    metrics: {
      avgFuelConsumption: '14.8L/100km',
      totalDistance: '32,450 km',
      nextServiceDue: '550 km'
    }
  }
];

const ActiveVehiclesManagement = ({ language }: { language: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const texts = {
    en: {
      activeVehicles: 'Vehicles Management',
      search: 'Search vehicles...',
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      maintenance: 'In Maintenance',
      vehicleId: 'Vehicle ID',
      type: 'Type',
      model: 'Model',
      licensePlate: 'License Plate',
      driver: 'Driver',
      status: 'Status',
      fuelLevel: 'Fuel',
      actions: 'Actions',
      viewDetails: 'View Details',
      vehicleDetails: 'Vehicle Details',
      vehicleInfo: 'Vehicle Information',
      lastMaintenance: 'Last Maintenance',
      currentLocation: 'Current Location',
      deliveriesTotal: 'Total Deliveries',
      deliveriesToday: 'Deliveries Today',
      performanceMetrics: 'Performance Metrics',
      fuelConsumption: 'Avg. Fuel Consumption',
      totalDistance: 'Total Distance',
      nextService: 'Next Service Due',
      filterByStatus: 'Filter by status',
      filterByType: 'Filter by type',
      car: 'Car',
      truck: 'Truck',
      motorcycle: 'Motorcycle',
      bus: 'Bus',
      close: 'Close'
    },
    ar: {
      activeVehicles: 'إدارة المركبات',
      search: 'بحث عن المركبات...',
      all: 'الكل',
      active: 'نشط',
      inactive: 'غير نشط',
      maintenance: 'قيد الصيانة',
      vehicleId: 'معرف المركبة',
      type: 'النوع',
      model: 'الموديل',
      licensePlate: 'لوحة الترخيص',
      driver: 'السائق',
      status: 'الحالة',
      fuelLevel: 'الوقود',
      actions: 'إجراءات',
      viewDetails: 'عرض التفاصيل',
      vehicleDetails: 'تفاصيل المركبة',
      vehicleInfo: 'معلومات المركبة',
      lastMaintenance: 'آخر صيانة',
      currentLocation: 'الموقع الحالي',
      deliveriesTotal: 'إجمالي التوصيلات',
      deliveriesToday: 'التوصيلات اليوم',
      performanceMetrics: 'مقاييس الأداء',
      fuelConsumption: 'متوسط استهلاك الوقود',
      totalDistance: 'المسافة الإجمالية',
      nextService: 'موعد الصيانة القادمة',
      filterByStatus: 'تصفية حسب الحالة',
      filterByType: 'تصفية حسب النوع',
      car: 'سيارة',
      truck: 'شاحنة',
      motorcycle: 'دراجة نارية',
      bus: 'حافلة',
      close: 'إغلاق'
    }
  };

  // Filter vehicles based on search term, status filter, and type filter
  const filteredVehicles = vehiclesList.filter(vehicle => {
    const matchesSearch = 
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                          vehicle.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesType = typeFilter === 'all' || 
                        vehicle.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'maintenance': return <CarIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  const getVehicleIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'car': return <CarIcon className="h-4 w-4" />;
      case 'truck': return <TruckIcon className="h-4 w-4" />;
      case 'bus': return <BusIcon className="h-4 w-4" />;
      case 'motorcycle': return <CarIcon className="h-4 w-4 rotate-45" />;
      default: return <CarIcon className="h-4 w-4" />;
    }
  };

  const handleViewVehicleDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">{texts[language].activeVehicles}</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={texts[language].search} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={texts[language].filterByStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{texts[language].all}</SelectItem>
              <SelectItem value="active">{texts[language].active}</SelectItem>
              <SelectItem value="inactive">{texts[language].inactive}</SelectItem>
              <SelectItem value="maintenance">{texts[language].maintenance}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={texts[language].filterByType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{texts[language].all}</SelectItem>
              <SelectItem value="car">{texts[language].car}</SelectItem>
              <SelectItem value="truck">{texts[language].truck}</SelectItem>
              <SelectItem value="motorcycle">{texts[language].motorcycle}</SelectItem>
              <SelectItem value="bus">{texts[language].bus}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{texts[language].vehicleId}</TableHead>
              <TableHead>{texts[language].type}</TableHead>
              <TableHead>{texts[language].model}</TableHead>
              <TableHead>{texts[language].licensePlate}</TableHead>
              <TableHead>{texts[language].driver}</TableHead>
              <TableHead>{texts[language].status}</TableHead>
              <TableHead>{texts[language].fuelLevel}</TableHead>
              <TableHead className="text-right">{texts[language].actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{vehicle.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getVehicleIcon(vehicle.type)}
                    <span>{vehicle.type}</span>
                  </div>
                </TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.driverName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`flex gap-1 ${getStatusColor(vehicle.status)}`}>
                    {getStatusIcon(vehicle.status)}
                    <span>{vehicle.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: vehicle.fuelLevel }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{vehicle.fuelLevel}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewVehicleDetails(vehicle)}
                    className="hover:bg-primary hover:text-white"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    {texts[language].viewDetails}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vehicle Details Modal */}
      <Dialog open={showVehicleModal} onOpenChange={setShowVehicleModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{texts[language].vehicleDetails}</DialogTitle>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">{texts[language].vehicleInfo}</h3>
                  <div className="space-y-2 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].vehicleId}</p>
                      <p className="font-medium">{selectedVehicle.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].type}</p>
                      <p className="font-medium">{selectedVehicle.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].model}</p>
                      <p className="font-medium">{selectedVehicle.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].licensePlate}</p>
                      <p className="font-medium">{selectedVehicle.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].driver}</p>
                      <p className="font-medium">{selectedVehicle.driverName} ({selectedVehicle.driverId})</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].lastMaintenance}</p>
                      <p className="font-medium">{selectedVehicle.lastMaintenance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].status}</p>
                      <Badge variant="outline" className={getStatusColor(selectedVehicle.status)}>
                        {selectedVehicle.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">{texts[language].performanceMetrics}</h3>
                  <div className="space-y-2 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].fuelConsumption}</p>
                      <p className="font-medium">{selectedVehicle.metrics.avgFuelConsumption}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].totalDistance}</p>
                      <p className="font-medium">{selectedVehicle.metrics.totalDistance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].nextService}</p>
                      <p className="font-medium">{selectedVehicle.metrics.nextServiceDue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].deliveriesTotal}</p>
                      <p className="font-medium">{selectedVehicle.totalDeliveries}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].deliveriesToday}</p>
                      <p className="font-medium">{selectedVehicle.deliveriesToday}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].fuelLevel}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: selectedVehicle.fuelLevel }}
                          ></div>
                        </div>
                        <span>{selectedVehicle.fuelLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">{texts[language].currentLocation}</h3>
                {selectedVehicle.currentLocation ? (
                  <div className="bg-gray-100 rounded-md p-4 text-center">
                    <p>Map would display here with location data:</p>
                    <p>
                      Lat: {selectedVehicle.currentLocation.lat}, 
                      Lng: {selectedVehicle.currentLocation.lng}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No location data available</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveVehiclesManagement;