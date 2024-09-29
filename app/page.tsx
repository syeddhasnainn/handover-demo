"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Add these new imports
import { Home, Users, Calendar, Settings, LogOut } from "lucide-react"
import patientData from './data/patientData.json';

interface Patient {
  disNo: string;
  cons: string;
  ward: string;
  nameDis: string;
  age: number;
  sex: string; // Add this line
  doiPresentation: string;
  diagnosis: string;
  history: string;
  opDate: string;
  bloodResults: string;
  plan: string;
  category: string;
  site: string; // Add this line
  traumaCategory?: string;
  tciDay?: string;
}

interface FilterProps {
  wards: string[];
  categories: string[];
  sites: string[]; // Add this line
  onFilterChange: (ward: string, category: string, site: string) => void; // Update this line
}

const Filter: React.FC<FilterProps> = ({ wards, categories, sites, onFilterChange }) => {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSite, setSelectedSite] = useState<string>("all"); // Add this line

  useEffect(() => {
    onFilterChange(selectedWard, selectedCategory, selectedSite);
  }, [selectedWard, selectedCategory, selectedSite, onFilterChange]);

  return (
    <div className="flex space-x-4 mb-4">
      <Select value={selectedWard} onValueChange={setSelectedWard}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Ward" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Wards</SelectItem>
          {wards.map((ward) => (
            <SelectItem key={ward} value={ward}>
              {ward}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedSite} onValueChange={setSelectedSite}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Site" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sites</SelectItem>
          {sites.map((site) => (
            <SelectItem key={site} value={site}>
              {site}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default function HomePage() {
  // Replace the demoPatients array with the imported data
  const [patients, setPatients] = useState<Patient[]>(patientData);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patientData);
  const [open, setOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient>({
    disNo: "",
    cons: "",
    ward: "",
    nameDis: "",
    age: 0,
    sex: "", // Add this line
    doiPresentation: "",
    diagnosis: "",
    history: "",
    opDate: "",
    bloodResults: "",
    plan: "",
    category: "",
    site: "", // Add this line
    traumaCategory: "",
    tciDay: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filterWard, setFilterWard] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSite, setFilterSite] = useState<string>("all"); // Add this line
  const [activeView, setActiveView] = useState('all');

  const wards = ["B1", "B2", "B3", "B4", "B5"];
  const categories = ["N/A", "General Upper Limb", "General Lower Limb", "Hand", "Hip"];
  const sites = ["PCH", "HH"]; // Add this line
  const tciOptions = ["N/A", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const filterPatientsByView = (patients: Patient[]) => {
    if (activeView === 'all') return patients;
    if (categories.includes(activeView)) {
      return patients.filter(p => p.category === activeView);
    }
    if (tciOptions.includes(activeView)) {
      return patients.filter(p => p.tciDay === activeView);
    }
    return patients;
  };

  useEffect(() => {
    const filtered = filterPatientsByView(patients.filter((patient) => {
      const wardMatch = filterWard === "all" || patient.ward === filterWard;
      const categoryMatch = filterCategory === "all" || patient.category === filterCategory;
      const siteMatch = filterSite === "all" || patient.site === filterSite;
      return wardMatch && categoryMatch && siteMatch;
    }));
    setFilteredPatients(filtered);
  }, [patients, filterWard, filterCategory, filterSite, activeView]);

  const handleFilterChange = (ward: string, category: string, site: string) => { // Update this line
    setFilterWard(ward);
    setFilterCategory(category);
    setFilterSite(site); // Add this line
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setCurrentPatient({ ...currentPatient, [id]: value });
  };

  const handleAddOrUpdatePatient = () => {
    if (isEditing) {
      setPatients(prevPatients => 
        prevPatients.map(p => p.disNo === currentPatient.disNo ? currentPatient : p)
      );
    } else {
      setPatients(prevPatients => [...prevPatients, currentPatient]);
    }
    setOpen(false);
    resetCurrentPatient();
  };

  const resetCurrentPatient = () => {
    setCurrentPatient({
      disNo: "",
      cons: "",
      ward: "",
      nameDis: "",
      age: 0,
      sex: "", // Add this line
      doiPresentation: "",
      diagnosis: "",
      history: "",
      opDate: "",
      bloodResults: "",
      plan: "",
      category: "",
      site: "", // Add this line
      traumaCategory: "",
      tciDay: "",
    });
    setIsEditing(false);
  };

  const openAddPatientDialog = () => {
    resetCurrentPatient();
    setOpen(true);
  };

  const openEditPatientDialog = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsEditing(true);
    setOpen(true);
  };

  const handleRemovePatient = (disNo: string) => {
    setPatients(prevPatients => prevPatients.filter(p => p.disNo !== disNo));
  };

  const handleMovePatient = (patient: Patient) => {
    // Implement the move functionality here
    console.log("Move patient:", patient);
    // For now, we'll just log the action. You can implement the actual move logic later.
  };
  const [activeTab, setActiveTab] = useState('patients')

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <div className="p-4">
          <h1 className="text-xl font-bold">eHandover</h1>
        </div>
        <nav className="mt-4">
          <Button
            variant={activeView === 'all' ? 'default' : 'ghost'}
            className="w-full justify-start mb-2"
            onClick={() => setActiveView('all')}
          >
            <Users className="mr-2 h-4 w-4" />
            All Patients
          </Button>
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-2">Categories</h2>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeView === category ? 'default' : 'ghost'}
                className="w-full justify-start mb-1 text-sm"
                onClick={() => setActiveView(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-2">TCI</h2>
            {tciOptions.map((day) => (
              <Button
                key={day}
                variant={activeView === day ? 'default' : 'ghost'}
                className="w-full justify-start mb-1 text-sm"
                onClick={() => setActiveView(day)}
              >
                {day}
              </Button>
            ))}
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-gray-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {activeView === 'all' ? 'All Patients' : `${activeView} Patients`}
            </h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddPatientDialog}>+ Add Patient</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{isEditing ? 'Update Patient' : 'Add Patient'}</DialogTitle>
                  <DialogDescription>
                    {isEditing ? 'Update patient details.' : 'Add a new patient to the system.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {[
                    { label: "Dis No", id: "disNo" },
                    { label: "Consultant", id: "cons" },
                    { label: "Name", id: "nameDis" },
                    { label: "Age", id: "age", type: "number" },
                    { label: "Sex", id: "sex" },
                    { label: "Date of Presentation", id: "doiPresentation" },
                    { label: "Diagnosis", id: "diagnosis" },
                    { label: "History", id: "history" },
                    { label: "Operation Date", id: "opDate" },
                    { label: "Blood Results", id: "bloodResults" },
                    { label: "Plan", id: "plan" },
                    { label: "Site", id: "site" }, // Add this line
                  ].map((field) => (
                    <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={field.id} className="text-right">
                        {field.label}
                      </Label>
                      {field.id === "history" || field.id === "plan" ? (
                        <Textarea
                          id={field.id}
                          value={currentPatient[field.id as keyof Patient]}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      ) : (
                        <Input
                          id={field.id}
                          type={field.type || "text"}
                          value={currentPatient[field.id as keyof Patient]}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      )}
                    </div>
                  ))}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ward" className="text-right">
                      Location
                    </Label>
                    <Select
                      onValueChange={(value) => setCurrentPatient({ ...currentPatient, ward: value })}
                      value={currentPatient.ward || undefined}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {["B1", "B2", "B3", "B4", "B5"].map((ward) => (
                          <SelectItem key={ward} value={ward}>
                            {ward}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      onValueChange={(value) => setCurrentPatient({ ...currentPatient, category: value })}
                      value={currentPatient.category || "N/A"}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tci" className="text-right">
                      TCI
                    </Label>
                    <Select
                      onValueChange={(value) => setCurrentPatient({ ...currentPatient, tci: value })}
                      value={currentPatient.tci || "N/A"}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select TCI" />
                      </SelectTrigger>
                      <SelectContent>
                        {tciOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="site" className="text-right">
                      Site
                    </Label>
                    <Select
                      onValueChange={(value) => setCurrentPatient({ ...currentPatient, site: value })}
                      value={currentPatient.site || undefined}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site} value={site}>
                            {site}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddOrUpdatePatient} type="submit">
                    {isEditing ? 'Update Patient' : 'Add Patient'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex space-x-4 mb-4">
            <Select value={filterWard} onValueChange={(value) => handleFilterChange(value, filterCategory, filterSite)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="B1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {wards.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={(value) => handleFilterChange(filterWard, value, filterSite)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Admitted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSite} onValueChange={(value) => handleFilterChange(filterWard, filterCategory, value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map((site) => (
                  <SelectItem key={site} value={site}>
                    {site}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredPatients.length === 0 ? (
            <p>No patients found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>DIS</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Consultant</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Date of Presentation</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>History</TableHead>
                  <TableHead>Operation Date</TableHead>
                  <TableHead>Blood Results</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient, index) => (
                  <TableRow key={index}>
                    <TableCell>{`DIS${patient.disNo}`}</TableCell>
                    <TableCell>{patient.disNo}</TableCell>
                    <TableCell>{patient.age}{patient.sex === "Male" ? "M" : "F"}</TableCell>
                    <TableCell>{patient.cons}</TableCell>
                    <TableCell>{patient.ward}</TableCell>
                    <TableCell>{patient.doiPresentation}</TableCell>
                    <TableCell>{patient.diagnosis}</TableCell>
                    <TableCell>{patient.history}</TableCell>
                    <TableCell>{patient.opDate}</TableCell>
                    <TableCell>{patient.bloodResults}</TableCell>
                    <TableCell>{patient.plan}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditPatientDialog(patient)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMovePatient(patient)}>
                            Move
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRemovePatient(patient.disNo)}>
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}