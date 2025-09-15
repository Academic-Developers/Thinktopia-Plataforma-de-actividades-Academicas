export interface Valores {
  icon: string;       
  titulo: string;     
  descripcion: string; 
}

export interface EquipoPrincipal {
  nombre: string;
  img: string;        
  cargo: string;    
  descripcion: string; 
}

export interface EquipoDesarrollo {
  nombre: string;       
  img: string;            
  rol: string;        
  descripcion: string;   
  link_portfolio: string; 
  tipo: 'local' | 'externo' | 'interno'; 
}
