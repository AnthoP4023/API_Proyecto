import { conmysql } from '../db.js';

export const getEventos =
async (req, res) => {
    try {
        const [result] = await conmysql.query(`
            SELECT 
                ev.ev_id, 
                msc.msc_nombres AS mascota,
                ev.ev_fecha, 
                ev.ev_hora, 
                ev.ev_notas, 
                tev.tev_nombre AS tipo_evento, 
                rep.rep_nombre AS repeticion
            FROM 
                eventos ev
            LEFT JOIN tiposeventos tev ON ev.tev_id = tev.tev_id
            LEFT JOIN repetir rep ON ev.rep_id = rep.rep_id
            INNER JOIN mascotas msc ON ev.msc_id = msc.msc_id
            `)
        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: 'Errod del lado del servidor' })
    }

}

// Obtener eventos por mascota
/* export const getEventosxmsc = async (req, res) => {
    try {
        const { msc_id } = req.params; // Cambiar el nombre para que coincida con el esquema de la base de datos.

        const [result] = await conmysql.query(`
            SELECT * 
            FROM eventos 
            WHERE msc_id = ?
        `, [msc_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron eventos para esta mascota." });
        }

        res.json(result);
    } catch (error) {
        console.error(error); // Para debug
        return res.status(500).json({ message: "Error al consultar los eventos." });
    }
}; */

export const getEventosxmsc = async (req, res) => {
    try {
        const { msc_id } = req.params;

        // Obtener el ID del usuario autenticado desde el token
        const usr_id = req.user.id;

        // Obtener el usr_id del token verificado
        //const { id: usr_id } = req.user;

        // Validar que el ID de la mascota esté presente
        if (!msc_id) {
            return res.status(400).json({ message: "Falta el parámetro: msc_id." });
        }

        // Query para obtener los eventos
        const [result] = await conmysql.query(`
            SELECT 
                ev.ev_id, 
                msc.msc_nombres AS mascota,
                ev.ev_fecha, 
                ev.ev_hora, 
                ev.ev_notas, 
                tev.tev_nombre AS tipo_evento, 
                rep.rep_nombre AS repeticion
            FROM 
                eventos ev
            LEFT JOIN tiposeventos tev ON ev.tev_id = tev.tev_id
            LEFT JOIN repetir rep ON ev.rep_id = rep.rep_id
            INNER JOIN mascotas msc ON ev.msc_id = msc.msc_id
            WHERE 
                ev.msc_id = 4 
                AND msc.usr_id = 1;
        `, [msc_id, usr_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron eventos para esta mascota y usuario." });
        }

        res.json(result);
    } catch (error) {
        console.error(error); // Para debug
        return res.status(500).json({ message: "Error al consultar los eventos." });
    }
};


// Crear un nuevo evento
export const postEvento = async (req, res) => {
    try {
        const { tev_id, msc_id, ev_notas, rep_id } = req.body;
        const usr_id = req.user.id; // ID del usuario autenticado

        // Validar que los campos requeridos estén presentes
        if (!tev_id || !msc_id) {
            return res.status(400).json({ message: "Faltan datos necesarios para crear el evento." });
        }

        // Validar que la mascota pertenece al usuario autenticado
        const [mascota] = await conmysql.query(`
            SELECT msc_id 
            FROM mascotas 
            WHERE msc_id = ? AND usr_id = ?
        `, [msc_id, usr_id]);

        if (mascota.length === 0) {
            return res.status(403).json({ message: "No tienes permiso para agregar eventos a esta mascota." });
        }

        const [rows] = await conmysql.query(`
            INSERT INTO eventos (tev_id, msc_id, ev_notas, rep_id) 
            VALUES (?, ?, ?, ?)
        `, [tev_id, msc_id, ev_notas, rep_id]);

        res.status(201).json({
            ev_id: rows.insertId,
            message: "Evento creado correctamente."
        });
    } catch (error) {
        console.error(error); // Para debug
        return res.status(500).json({ message: "Error al crear el evento." });
    }
};

// Actualizar un evento existente
export const putEvento = async (req, res) => {
    try {
        const { id } = req.params; // Cambiar para que coincida con la ruta
        const { tev_id, msc_id, ev_fecha, ev_hora, ev_notas, rep_id } = req.body;
        const usr_id = req.user.id; // ID del usuario autenticado

        // Validar que el evento pertenece al usuario autenticado
        const [evento] = await conmysql.query(`
            SELECT ev.ev_id 
            FROM eventos ev
            INNER JOIN mascotas msc ON ev.msc_id = msc.msc_id
            WHERE ev.ev_id = ? AND msc.usr_id = ?
        `, [id, usr_id]);

        if (evento.length === 0) {
            return res.status(403).json({ message: "No tienes permiso para actualizar este evento." });
        }

        const [result] = await conmysql.query(`
            UPDATE eventos 
            SET tev_id = ?, msc_id = ?, ev_fecha = ?, ev_hora = ?, ev_notas = ?, rep_id = ? 
            WHERE ev_id = ?
        `, [tev_id, msc_id, ev_fecha, ev_hora, ev_notas, rep_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Evento no encontrado." });
        }

        res.json({ message: "Evento actualizado correctamente." });
    } catch (error) {
        console.error(error); // Para debug
        return res.status(500).json({ message: "Error al actualizar el evento." });
    }
};

export const patchEvento = async (req, res) => {
    try {
        const { id } = req.params; // ID del evento que se desea modificar
        const { tev_id, msc_id, ev_fecha, ev_hora, ev_notas, rep_id } = req.body; // Extrae los campos a actualizar
        const usr_id = req.user.id; // ID del usuario autenticado extraído del token

        // Validar que el evento pertenece al usuario autenticado
        const [evento] = await conmysql.query(`
            SELECT ev.ev_id 
            FROM eventos ev
            INNER JOIN mascotas msc ON ev.msc_id = msc.msc_id
            WHERE ev.ev_id = ? AND msc.usr_id = ?
        `, [id, usr_id]);

        if (evento.length === 0) {
            return res.status(403).json({ message: "No tienes permiso para modificar este evento." });
        }

        const [result] = await conmysql.query(`
            UPDATE eventos 
            SET 
                tev_id = IFNULL(?, tev_id), 
                msc_id = IFNULL(?, msc_id), 
                ev_fecha = IFNULL(?, ev_fecha), 
                ev_hora = IFNULL(?, ev_hora), 
                ev_notas = IFNULL(?, ev_notas), 
                rep_id = IFNULL(?, rep_id) 
            WHERE ev_id = ?
        `, [tev_id, msc_id, ev_fecha, ev_hora, ev_notas, rep_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Evento no encontrado." });
        }

        // Opcional: Retornar los datos actualizados para confirmar
        const [updatedEvent] = await conmysql.query('SELECT * FROM eventos WHERE ev_id = ?', [id]);
        res.json({ message: "Evento actualizado parcialmente.", event: updatedEvent[0] });
    } catch (error) {
        console.error(error); // Para debug
        return res.status(500).json({ message: "Error al actualizar el evento." });
    }
};

// Eliminar un evento
export const deleteEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const usr_id = req.user.id; // ID del usuario autenticado

        // Validar que el evento pertenece al usuario autenticado
        const [evento] = await conmysql.query(`
            SELECT ev.ev_id 
            FROM eventos ev
            INNER JOIN mascotas msc ON ev.msc_id = msc.msc_id
            WHERE ev.ev_id = ? AND msc.usr_id = ?
        `, [id, usr_id]);

        if (evento.length === 0) {
            return res.status(403).json({ message: "No tienes permiso para eliminar este evento." });
        }

        const [result] = await conmysql.query(`
            DELETE FROM eventos 
            WHERE ev_id = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Evento no encontrado." });
        }

        res.json({ message: "Evento eliminado correctamente." });
    } catch (error) {
        console.error(error); // Para debug
        return res.status(500).json({ message: "Error al eliminar el evento." });
    }
};
