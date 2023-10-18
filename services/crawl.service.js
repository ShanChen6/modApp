const axios = require('axios')
const cheerio = require('cheerio')
const { transValidation } = require('../langs/errors/vn')

// const url = 'https://play.google.com/store/apps/details?id=com.gameloft.android.ANMP.GloftGLCL';
exports.crawlApp = async (req, res) => {
    try {
        const url = req.query.path
        const response = await axios.get(url)
        const html = response.data
        const $ = cheerio.load(html)

        
        // Lấy thông tin cơ bản về ứng dụng
        const appName = $('h1 span').text()
        const developer = $('.Vbfug a span').text()
        const ratingText = $('.TT9eCd').text()
        var rating = parseFloat(ratingText.replace(/[^\d.]/g, ''));
        console.log(appName)
        console.log(developer)
        console.log(rating)
        var icon = []
        const screenshots = []
        const categories = []

        iconElements = $('.Mqg6jb img')
        if (iconElements.length <= 0) {
            iconElements = $('.l8YSdd img')
        }
        const imageUrl = $(iconElements[0]).attr('srcset')
        console.log(imageUrl)
        const match = imageUrl.match(/(https:\/\/[^\s]+)/)
        console.log(match[0])
        icon = match[0]
        const imgElement = $('.PyyLUd img');
        var banner;
        if (imgElement.length > 0) {
            banner = imgElement.attr('src');
            console.log(banner);
        } else {
            console.log('Không tìm thấy URL của hình ảnh');
        }
        //lấy banner
        // Trích xuất danh sách hình ảnh chụp màn hình
        const imgElements = $('div[jsname="K9a4Re"] img')
        const getImageData = (element) => {
            const imageUrl = $(element).attr('srcset')
            const match = imageUrl.match(/(https:\/\/[^\s]+)/)
            screenshots.push(match[0])
        }
        const imagePromises = imgElements
            .map((index, element) => getImageData(element))
            .get()
        const spanElements = $('.Uc6QCc span.VfPpkd-vQzf8d')
        spanElements.each((index, element) => {
            const text = $(element).text()
            categories.push(text)
        })
        
        return Promise.all(imagePromises).then(() => {
            const appInfo = {
                url,
                appName,
                categories,
                developer,
                rating,
                icon,
                banner,
                screenshots,
            }

            res.json(appInfo)
        })
    } catch (error) {
        console.error(error)
    }
}
