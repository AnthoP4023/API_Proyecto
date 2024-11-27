import{conmysql} from '../db.js'

export const getCursos=
async (req,res) => {
    try {
        const [result]= await conmysql.query(' select * from cursos where msc_id is null ')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message:"Error  al consultar curso"})
    }
}

export const getCursosxid=
async(req, res)=>{
    try {
        const [result]=await conmysql.query('select * from cursos where crs_id=?', [req.params.id])
        if(result.length<=0)return res.status(404).json({
            cli_id:0,
            message:"Curso no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'Error  del lado del servidor'})
    }
}