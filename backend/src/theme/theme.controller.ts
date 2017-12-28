import {Controller, Get, Put, Req, Res} from '@nestjs/common';
import {ThemeService} from './theme.service';
import {Theme} from './theme.interface';

@Controller('api')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {
  }

  @Get('/themes')
  async findAll(): Promise<Theme[]> {
    return this.themeService.findAll();
  }

  @Get('/themes/:id')
  private async findOne(@Req() req, @Res() res) {
    const theme = await this.themeService.findOne(req.params.id);
    res.json({theme});
  }

  @Put('/themes/:id')
  private updateThemeConfig(@Req() req, @Res() res) {
    this.themeService.update(req.params.id, req.body, (err, theme) => {
      if (err) {
        return console.error(err);
      }
      res.json(theme);
    });
  }
}
