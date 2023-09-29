import { nanoid } from "nanoid"
import { Link } from "../models/Link.js"




export const getLinks = async (req, res) => {

  try {
    const links = await Link.find({ uid: req.uid })
    return res.json({ links })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'error de servidor'})
  }
}

//Acceso a todos
export const getLinkFree = async (req, res) => {
  try {
    const { nanoLink } = req.params
    const link = await Link.findOne({ nanoLink })

    if(!link) {
        return res.status(404).json({ error: 'No existe el link'})
    }

    return res.json({ longLink: link.longLink })
    
  } catch (error) {
    if(error.kind === "ObjectId") {
        return res.status(403).json({ error: 'Formato id incorrecto'})
    }
    return res.status(500).json({ error: 'error de servidor'})
  }
}

//Para CRUD
export const getLink = async (req, res) => {
  try {
    const { id } = req.params
    const link = await Link.findById({ _id: id })

    if(!link) {
        return res.status(404).json({ error: 'No existe el link'})
    }

    if(!link.uid.equals(req.uid)) {
        return res.status(401).json({ error: 'Acceso denegado'})
    }

    return res.json({ link })


    
  } catch (error) {
    if(error.kind === "ObjectId") {
        return res.status(403).json({ error: 'Formato id incorrecto'})
    }
    return res.status(500).json({ error: 'error de servidor'})
  }
}


export const createLink = async (req, res) => {

  try {
    let { longLink } = req.body

    if(!longLink.startsWith("https://")){
        longLink = "https://" + longLink
    }

    const link = new Link({ 
        longLink,
        nanoLink: nanoid(6),
        uid: req.uid
    })
    const newLink = await link.save()

    return res.status(201).json({ newLink })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'error de servidor'})
  }
}


export const removeLink = async (req, res) => {
  try {
    const { id } = req.params
    const link = await Link.findById({ _id: id })

    if(!link) {
        return res.status(404).json({ error: 'No existe el link'})
    }

    if(!link.uid.equals(req.uid)) {
        return res.status(401).json({ error: 'Acceso denegado'})
    }

    await link.deleteOne()
    return res.json({ ok: 'Link eliminado' })

    
  } catch (error) {
    if(error.kind === "ObjectId") {
        return res.status(403).json({ error: 'Formato id incorrecto'})
    }
    return res.status(500).json({ error: 'error de servidor'})
  }
}


export const updateLink = async (req, res) => {
  try {
    const { id } = req.params
    let { longLink } = req.body

    if(!longLink.startsWith("https://")){
        longLink = "https://" + longLink
    }

    const link = await Link.findById({ _id: id })

    if(!link) {
        return res.status(404).json({ error: 'No existe el link'})
    }

    if(!link.uid.equals(req.uid)) {
        return res.status(401).json({ error: 'Acceso denegado'})
    }

    //-Update
    link.longLink = longLink
    await link.save()

    return res.json({ ok: 'Link Actualizado' })

    
  } catch (error) {
    console.log(error);
    if(error.kind === "ObjectId") {
        return res.status(403).json({ error: 'Formato id incorrecto'})
    }
    return res.status(500).json({ error: 'error de servidor'})
  }
}