'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Twitter, Download } from "lucide-react"
import html2canvas from 'html2canvas'
import Image from 'next/image'

const themes = {
    default: 'bg-gradient-to-r from-blue-500 to-purple-500',
    nature: 'bg-gradient-to-r from-green-400 to-blue-500',
    sunset: 'bg-gradient-to-r from-orange-500 to-pink-500',
    monochrome: 'bg-gradient-to-r from-gray-700 to-gray-900',
}

export default function MembershipCardGenerator() {
    const [name, setName] = useState('')
    const [cawangan, setCawangan] = useState('')
    const [image, setImage] = useState<string | null>(null)
    const [theme, setTheme] = useState('default')
    const cardRef = useRef<HTMLDivElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const generateImage = async () => {
        if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current)
            return canvas.toDataURL('image/png')
        }
    }

    const shareToTwitter = async () => {
        const imageUrl = await generateImage()
        const tweetText = encodeURIComponent('Check out my Global Ikhwan Sdn Bhd membership card!')
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(imageUrl || '')}`
        window.open(twitterUrl, '_blank')
    }

    const saveImage = async () => {
        const imageUrl = await generateImage()
        if (imageUrl) {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = 'membership-card.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-center">Membership Card Generator</h1>
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="cawangan">Cawangan</Label>
                <Select value={cawangan} onValueChange={setCawangan}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select cawangan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="putrajaya">Putrajaya</SelectItem>
                        <SelectItem value="cyberjaya">Cyberjaya</SelectItem>
                        <SelectItem value="bangi">Bangi</SelectItem>
                        <SelectItem value="country-homes">Country Homes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="sunset">Sunset</SelectItem>
                        <SelectItem value="monochrome">Monochrome</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Card ref={cardRef} className={`${themes[theme as keyof typeof themes]} text-white`}>
                <CardContent className="p-6 space-y-4">
                    <div className="text-center font-bold text-2xl">Global Ikhwan Sdn Bhd</div>
                    <div className="flex items-center space-x-4">
                        {image && <Image src={image} alt="Member" className="w-24 h-24 rounded-full object-cover" />}
                        <div>
                            <div className="font-semibold text-lg">{name || 'Member Name'}</div>
                            <div>Cawangan: {cawangan ? capitalizeFirstLetter(cawangan) : 'Not selected'}</div>
                            <div>Tarikh Mula Keahlian: {formatDate(new Date())}</div>
                        </div>
                    </div>
                    <div className="text-xs italic text-center mt-4">
                        &quot;Pasar Ikhwan di Putrajaya, siapakah dia Abuya&quot;
                    </div>
                </CardContent>
            </Card>
            <div className="flex space-x-2">
                <Button onClick={saveImage} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Save as Image
                </Button>
                <Button onClick={shareToTwitter} className="flex-1">
                    <Twitter className="mr-2 h-4 w-4" />
                    Share to Twitter
                </Button>
            </div>
        </div>
    )
}