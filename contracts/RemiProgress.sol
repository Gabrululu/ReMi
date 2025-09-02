// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RemiProgress
 * @dev Contrato para tracking on-chain del progreso de usuarios en ReMi
 * - Tareas completadas, metas, rachas, misiones semanales
 * - Eventos para indexación y verificación
 * - Seguridad: solo escritura del propio usuario y OWNER para misiones
 */
contract RemiProgress is Ownable {
    
    // Structs
    struct Progreso {
        uint256 tareasCompletadas;
        uint256 metasCompletadas;
        uint256 rachaActual;
        uint256 ultimaFecha; // timestamp del último check-in
        uint256 misionesSemanaId;
        mapping(uint256 => uint256) progresoMisiones; // missionId => progreso
    }
    
    struct MisionSemanal {
        string titulo;
        string descripcion;
        uint256 objetivo;
        uint256 recompensa;
        bool activa;
    }
    
    // Storage
    mapping(address => Progreso) public progresoUsuarios;
    mapping(uint256 => MisionSemanal) public misionesSemanales;
    uint256 public misionSemanaActual;
    uint256 public totalUsuarios;
    
    // Events
    event TaskCompleted(address indexed user, uint256 taskId, uint256 timestamp);
    event GoalCompleted(address indexed user, uint256 goalId, uint256 timestamp);
    event StreakUpdated(address indexed user, uint256 streak, uint256 timestamp);
    event MissionProgressed(address indexed user, uint256 missionId, uint256 value, uint256 timestamp);
    event WeeklyMissionsSet(uint256 weekId, uint256 timestamp);
    event UserRegistered(address indexed user, uint256 timestamp);
    
    // Modifiers
    modifier soloUsuario() {
        require(msg.sender != address(0), "Usuario invalido");
        _;
    }
    
    modifier misionActiva(uint256 missionId) {
        require(misionesSemanales[missionId].activa, "Mision no activa");
        _;
    }
    
    // Constructor
    constructor() Ownable(msg.sender) {
        misionSemanaActual = 1;
    }
    
    // Funciones principales
    
    /**
     * @dev Registra una tarea completada
     * @param taskId ID único de la tarea
     */
    function completeTask(uint256 taskId) external soloUsuario {
        Progreso storage progreso = progresoUsuarios[msg.sender];
        
        // Si es la primera tarea, registrar usuario
        if (progreso.tareasCompletadas == 0) {
            totalUsuarios++;
            emit UserRegistered(msg.sender, block.timestamp);
        }
        
        progreso.tareasCompletadas++;
        
        emit TaskCompleted(msg.sender, taskId, block.timestamp);
    }
    
    /**
     * @dev Registra una meta completada
     * @param goalId ID único de la meta
     */
    function completeGoal(uint256 goalId) external soloUsuario {
        Progreso storage progreso = progresoUsuarios[msg.sender];
        progreso.metasCompletadas++;
        
        emit GoalCompleted(msg.sender, goalId, block.timestamp);
    }
    
    /**
     * @dev Incrementa la racha del usuario (solo una vez por día)
     */
    function bumpStreak() external soloUsuario {
        Progreso storage progreso = progresoUsuarios[msg.sender];
        
        // Verificar que no se haya hecho check-in hoy
        uint256 hoy = block.timestamp / 1 days;
        uint256 ultimoCheckIn = progreso.ultimaFecha / 1 days;
        
        require(hoy > ultimoCheckIn, "Ya hiciste check-in hoy");
        
        progreso.rachaActual++;
        progreso.ultimaFecha = block.timestamp;
        
        emit StreakUpdated(msg.sender, progreso.rachaActual, block.timestamp);
    }
    
    /**
     * @dev Actualiza el progreso de una misión semanal
     * @param missionId ID de la misión
     * @param value Valor del progreso
     */
    function setMissionProgress(uint256 missionId, uint256 value) external soloUsuario misionActiva(missionId) {
        Progreso storage progreso = progresoUsuarios[msg.sender];
        progreso.progresoMisiones[missionId] = value;
        
        emit MissionProgressed(msg.sender, missionId, value, block.timestamp);
    }
    
    // Funciones de lectura
    
    /**
     * @dev Obtiene el progreso completo de un usuario
     * @param user Dirección del usuario
     */
    function getProgreso(address user) external view returns (
        uint256 tareasCompletadas,
        uint256 metasCompletadas,
        uint256 rachaActual,
        uint256 ultimaFecha
    ) {
        Progreso storage progreso = progresoUsuarios[user];
        return (
            progreso.tareasCompletadas,
            progreso.metasCompletadas,
            progreso.rachaActual,
            progreso.ultimaFecha
        );
    }
    
    /**
     * @dev Obtiene el progreso de una misión específica
     * @param user Dirección del usuario
     * @param missionId ID de la misión
     * @return progreso del usuario en esa misión
     */
    function getProgresoMision(address user, uint256 missionId) external view returns (uint256) {
        return progresoUsuarios[user].progresoMisiones[missionId];
    }
    
    /**
     * @dev Obtiene información de una misión semanal
     * @param missionId ID de la misión
     */
    function getMisionSemanal(uint256 missionId) external view returns (
        string memory titulo,
        string memory descripcion,
        uint256 objetivo,
        uint256 recompensa,
        bool activa
    ) {
        MisionSemanal storage mision = misionesSemanales[missionId];
        return (
            mision.titulo,
            mision.descripcion,
            mision.objetivo,
            mision.recompensa,
            mision.activa
        );
    }
    
    /**
     * @dev Verifica si una tarea fue completada on-chain
     * @param user Dirección del usuario
     * @param taskId ID de la tarea
     * @return true si la tarea fue registrada on-chain
     */
    function isTaskCompletedOnChain(address user, uint256 taskId) external view returns (bool) {
        // Esta función requeriría indexación de eventos para ser precisa
        // Por ahora, verificamos si el usuario tiene tareas completadas
        return progresoUsuarios[user].tareasCompletadas > 0;
    }
    
    // Funciones de administración (solo OWNER)
    
    /**
     * @dev Establece las misiones semanales (solo OWNER)
     * @param weekId ID de la semana
     * @param titulos Array de títulos
     * @param descripciones Array de descripciones
     * @param objetivos Array de objetivos
     * @param recompensas Array de recompensas
     */
    function setWeeklyMissions(
        uint256 weekId,
        string[] memory titulos,
        string[] memory descripciones,
        uint256[] memory objetivos,
        uint256[] memory recompensas
    ) external onlyOwner {
        require(
            titulos.length == descripciones.length &&
            titulos.length == objetivos.length &&
            titulos.length == recompensas.length,
            "Arrays deben tener la misma longitud"
        );
        
        for (uint256 i = 0; i < titulos.length; i++) {
            uint256 missionId = weekId * 100 + i; // ID único por semana
            misionesSemanales[missionId] = MisionSemanal({
                titulo: titulos[i],
                descripcion: descripciones[i],
                objetivo: objetivos[i],
                recompensa: recompensas[i],
                activa: true
            });
        }
        
        misionSemanaActual = weekId;
        emit WeeklyMissionsSet(weekId, block.timestamp);
    }
    
    /**
     * @dev Desactiva una misión (solo OWNER)
     * @param missionId ID de la misión
     */
    function deactivateMission(uint256 missionId) external onlyOwner {
        misionesSemanales[missionId].activa = false;
    }
    
    /**
     * @dev Resetea la racha de un usuario (solo OWNER, para casos especiales)
     * @param user Dirección del usuario
     */
    function resetUserStreak(address user) external onlyOwner {
        progresoUsuarios[user].rachaActual = 0;
        progresoUsuarios[user].ultimaFecha = 0;
        
        emit StreakUpdated(user, 0, block.timestamp);
    }
}
