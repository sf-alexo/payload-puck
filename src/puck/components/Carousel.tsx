'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

type CarouselSlide = {
  title: string
  description?: string
  imageId?: string
  imageUrl?: string
}

type CarouselProps = {
  slides: CarouselSlide[]
}

export default function Carousel({ slides }: CarouselProps) {
  return (
    <section style={{ padding: '48px 24px', background: '#0b1120' }}>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        style={{ padding: '0 24px' }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: '#1e293b',
                borderRadius: 12,
                padding: 24,
                color: '#fff',
                height: '100%',
              }}
            >
              {(slide.imageUrl || slide.imageId) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.imageUrl || `/api/media/${slide.imageId}`}
                  alt={slide.title}
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }}
                />
              )}
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{slide.title}</h3>
              {slide.description && (
                <div style={{ margin: 0, opacity: 0.8, fontSize: '0.95rem' }}>
                  {slide.description}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
